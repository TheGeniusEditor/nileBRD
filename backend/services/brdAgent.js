/**
 * BRD Agent — Neural AI analysis engine using Transformers.js.
 *
 * Uses a real transformer neural network (DeBERTa-v3) for zero-shot classification.
 * No API keys. Models download once (~85MB) and cache locally.
 *
 * Pipeline:
 *  1. Zero-shot classification (Xenova/nli-deberta-v3-small) — classify each message
 *  2. TF-IDF keyword extraction — fast, accurate for domain keywords
 *  3. Pattern-based BRD readiness — deterministic domain checks
 *  4. Executive summary — synthesised from top-scored messages per category
 */

import { pipeline, env } from "@xenova/transformers";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
env.cacheDir = join(__dirname, "../../models");
// Suppress verbose download logs in production
env.allowLocalModels = true;

const MODEL_ID = "Xenova/nli-deberta-v3-small";

const CANDIDATE_LABELS = [
  "business requirement or functional need",
  "risk, concern, or problem",
  "action item or next step",
  "general discussion",
];

// Singleton model loader — loads once, reused for all requests
let _classifier = null;
let _loading = false;
let _loadPromise = null;

async function getClassifier() {
  if (_classifier) return _classifier;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    console.log("[BRD Agent] Loading neural model (first run may take ~30s)…");
    _classifier = await pipeline("zero-shot-classification", MODEL_ID, {
      quantized: true, // use quantized ONNX — smaller, faster, still accurate
    });
    console.log("[BRD Agent] Neural model ready.");
    return _classifier;
  })();

  return _loadPromise;
}

// Model loads lazily on first classification request — not on server start.

// ─── Stopwords ────────────────────────────────────────────────────────────────
const STOPWORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","it","its","as","be","was","are","were","been","has",
  "have","had","do","does","did","not","no","so","if","this","that","these",
  "those","my","your","his","her","our","their","we","i","you","he","she",
  "they","me","him","us","them","what","which","who","how","when","where",
  "why","will","would","could","should","may","might","can","just","also",
  "more","some","any","all","very","too","even","about","up","out","then",
  "than","there","into","only","like","over","after","before","again","get",
  "got","make","made","going","go","well","still","know","think","see","say",
  "said","im","ive","id","dont","doesnt","isnt","wasnt","thats","its",
]);

// ─── BRD domain patterns (used for readiness check only) ─────────────────────
const REQUIREMENT_RE = [
  /\b(need|needs|needed)\b/i,
  /\b(require[sd]?|requirement[s]?)\b/i,
  /\b(must|should|shall)\b/i,
  /\b(want[s]?|wanted)\b/i,
  /\b(expect[s]?|expected|expectation[s]?)\b/i,
  /\b(necessary|essential|critical|mandatory)\b/i,
  /\b(has to|have to|need to)\b/i,
  /\b(feature[s]?|functionality|capability|capabilities)\b/i,
  /\b(allow[s]?|enable[s]?|support[s]?|provide[s]?)\b/i,
];
const CONCERN_RE = [
  /\b(issue[s]?|problem[s]?)\b/i,
  /\b(concern[s]?|concerned)\b/i,
  /\b(risk[s]?|risky)\b/i,
  /\b(challenge[s]?|difficult[y]?)\b/i,
  /\b(block[s]?|blocker[s]?|blocked)\b/i,
  /\b(worr(y|ied|ies)|worried)\b/i,
  /\b(unclear|uncertain|unsure|ambiguous)\b/i,
  /\b(delay[s]?|delayed|late)\b/i,
  /\b(fail[s]?|failure|error[s]?|bug[s]?)\b/i,
];
const TIMELINE_RE = /\b(week[s]?|month[s]?|day[s]?|deadline[s]?|due|sprint[s]?|quarter|asap|urgent|soon|by \w+day|q[1-4])\b/i;
const STAKEHOLDER_RE = /\b(user[s]?|stakeholder[s]?|team[s]?|client[s]?|customer[s]?|manager|director|owner[s]?|department)\b/i;
const SUCCESS_RE = /\b(success|successf[a-z]+|goal[s]?|objective[s]?|outcome[s]?|kpi[s]?|metric[s]?|measur[a-z]+|achiev[a-z]+)\b/i;

// ─── TF-IDF keyword extraction ────────────────────────────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function computeTfIdf(docs) {
  const N = docs.length;
  if (N === 0) return {};
  const tfDocs = docs.map((d) => {
    const tokens = tokenize(d);
    const tf = {};
    tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
    const max = Math.max(...Object.values(tf), 1);
    Object.keys(tf).forEach((t) => { tf[t] = tf[t] / max; });
    return tf;
  });
  const df = {};
  tfDocs.forEach((tf) => Object.keys(tf).forEach((t) => { df[t] = (df[t] || 0) + 1; }));
  const scores = {};
  tfDocs.forEach((tf) => {
    Object.entries(tf).forEach(([t, freq]) => {
      const idf = Math.log((N + 1) / (df[t] + 1)) + 1;
      scores[t] = (scores[t] || 0) + freq * idf;
    });
  });
  return scores;
}

function topKeywords(tfidf, n = 10) {
  return Object.entries(tfidf)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term]) => term);
}

// ─── Deduplication: remove near-duplicate sentences ──────────────────────────
function deduplicate(sentences) {
  const kept = [];
  for (const s of sentences) {
    const tokens = new Set(tokenize(s));
    const isDup = kept.some((k) => {
      const kTokens = new Set(tokenize(k));
      const intersection = [...tokens].filter((t) => kTokens.has(t)).length;
      const union = new Set([...tokens, ...kTokens]).size;
      return union > 0 && intersection / union > 0.65;
    });
    if (!isDup) kept.push(s);
  }
  return kept;
}

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ─── BRD Readiness (pattern-based — deterministic, domain-accurate) ───────────
function brdReadiness(messages) {
  const allText = messages.map((m) => m.message_text).join(" ");
  const checks = [
    { label: "Requirements defined",    pass: REQUIREMENT_RE.some((r) => r.test(allText)) },
    { label: "Stakeholders identified", pass: STAKEHOLDER_RE.test(allText) },
    { label: "Timelines mentioned",     pass: TIMELINE_RE.test(allText) },
    { label: "Success criteria present",pass: SUCCESS_RE.test(allText) },
    { label: "Risks / concerns raised", pass: CONCERN_RE.some((r) => r.test(allText)) },
  ];
  const score = checks.filter((c) => c.pass).length;
  let readinessLevel;
  if (score >= 5)      readinessLevel = "High — ready to start BRD draft";
  else if (score >= 3) readinessLevel = "Medium — a few gaps remain";
  else                 readinessLevel = "Low — more discussion needed";
  return { checks, score, readinessLevel };
}

// ─── Executive summary: synthesise from top messages per category ─────────────
function buildExecutiveSummary(categorised, requestInfo) {
  const parts = [];
  if (categorised.requirements.length) {
    parts.push(cap(categorised.requirements[0].text));
  }
  if (categorised.concerns.length) {
    parts.push(`Key concern: ${categorised.concerns[0].text.toLowerCase()}`);
  }
  if (categorised.actions.length) {
    parts.push(`Next step: ${categorised.actions[0].text.toLowerCase()}`);
  }
  if (!parts.length) {
    return `Discussion for "${requestInfo.title}" covers the core business need. Review the marked messages for detailed context.`;
  }
  return parts.join(" ");
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Async — uses real neural network for classification.
 *
 * @param {Array<{message_text:string, sender_name:string, marked_at:string}>} messages
 * @param {{title:string, description:string, category:string, priority:string, status:string}} requestInfo
 * @returns {Promise<object>} structured analysis
 */
export async function analyseKeyPoints(messages, requestInfo) {
  if (!messages || messages.length === 0) {
    return { error: "No key points to analyse. Please mark at least one message first." };
  }

  // ── 1. TF-IDF keywords (fast, run first) ──────────────────────────────────
  const docs = messages.map((m) => m.message_text);
  const tfidf = computeTfIdf(docs);
  const keywords = topKeywords(tfidf, 10);

  // ── 2. Neural zero-shot classification ────────────────────────────────────
  let categorised = { requirements: [], concerns: [], actions: [], general: [] };

  try {
    const classifier = await getClassifier();

    // Classify all messages in parallel (model handles batching internally)
    const results = await Promise.all(
      messages.map((m) =>
        classifier(m.message_text, CANDIDATE_LABELS, { multi_label: false })
      )
    );

    results.forEach((result, i) => {
      const msg = messages[i];
      const topLabel = result.labels[0]; // highest-confidence label
      const confidence = result.scores[0];

      const entry = {
        text: msg.message_text,
        sender: msg.sender_name,
        confidence,
      };

      if (topLabel.includes("requirement") || topLabel.includes("functional")) {
        categorised.requirements.push(entry);
      } else if (topLabel.includes("risk") || topLabel.includes("concern") || topLabel.includes("problem")) {
        categorised.concerns.push(entry);
      } else if (topLabel.includes("action") || topLabel.includes("next step")) {
        categorised.actions.push(entry);
      } else {
        categorised.general.push(entry);
      }
    });

    // Sort each category by confidence descending
    for (const key of Object.keys(categorised)) {
      categorised[key].sort((a, b) => b.confidence - a.confidence);
    }

    console.log(`[BRD Agent] Classified ${messages.length} messages via neural model.`);
  } catch (err) {
    // Graceful fallback to TF-IDF + patterns if model fails
    console.warn("[BRD Agent] Neural classification failed, falling back to pattern matching:", err.message);
    messages.forEach((m) => {
      const text = m.message_text;
      const entry = { text, sender: m.sender_name, confidence: 0.5 };
      const isReq = REQUIREMENT_RE.some((r) => r.test(text));
      const isCon = CONCERN_RE.some((r) => r.test(text));
      if (isReq) categorised.requirements.push(entry);
      else if (isCon) categorised.concerns.push(entry);
      else categorised.actions.push(entry);
    });
  }

  // ── 3. Deduplicate and cap each section ───────────────────────────────────
  const pickTop = (items, n) =>
    deduplicate(items.map((i) => i.text))
      .slice(0, n)
      .map((t) => cap(t.trim()));

  const requirements = pickTop(categorised.requirements, 6);
  const concerns = pickTop(categorised.concerns, 5);
  const actions = pickTop(categorised.actions, 5);

  // Fallback: pull from general if a section is empty
  const generalTexts = deduplicate(
    [...categorised.general, ...categorised.requirements, ...categorised.concerns, ...categorised.actions]
      .map((i) => i.text)
  ).map((t) => cap(t.trim()));

  // ── 4. BRD readiness (deterministic pattern checks) ───────────────────────
  const readiness = brdReadiness(messages);

  // ── 5. Executive summary ──────────────────────────────────────────────────
  const summary = buildExecutiveSummary(
    {
      requirements: categorised.requirements,
      concerns: categorised.concerns,
      actions: categorised.actions,
    },
    requestInfo
  );

  return {
    generated_at: new Date().toISOString(),
    ai_model: MODEL_ID,
    request: {
      title: requestInfo.title,
      category: requestInfo.category,
      priority: requestInfo.priority,
      status: requestInfo.status,
    },
    executive_summary: summary,
    key_requirements: requirements.length ? requirements : generalTexts.slice(0, 4),
    stakeholder_concerns: concerns,
    action_items: actions,
    keywords,
    brd_readiness: readiness,
    message_count: messages.length,
  };
}
