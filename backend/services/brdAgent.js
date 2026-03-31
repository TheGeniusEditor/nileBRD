/**
 * BRD Agent — a self-contained NLP analysis engine.
 *
 * No external AI API. Runs entirely on the backend using:
 *  - TF-IDF keyword extraction
 *  - Pattern-based sentence classification (requirements / concerns / actions)
 *  - Sentence importance scoring
 *  - BRD readiness heuristics
 */

// ─── Stopwords ───────────────────────────────────────────────────────────────
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

// ─── Classification patterns ──────────────────────────────────────────────────
const REQUIREMENT_RE = [
  /\b(need|needs|needed|needn['']t)\b/i,
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
  /\b(not sure|don['']t know|doesn['']t work)\b/i,
  /\b(delay[s]?|delayed|late|miss(ing)?)\b/i,
  /\b(fail[s]?|failure|error[s]?|bug[s]?)\b/i,
  /\b(compli[a-z]+)\b/i,
  /\b(impact[s]?|affect[s]?)\b/i,
];

const ACTION_RE = [
  /\b(follow[- ]?up|action[s]?|task[s]?)\b/i,
  /\b(schedule[d]?|plan[s]?|planned)\b/i,
  /\b(review[s]?|reviewed)\b/i,
  /\b(confirm[s]?|confirmed|confirmation)\b/i,
  /\b(check[s]?|verify|verified)\b/i,
  /\b(update[s]?|updated)\b/i,
  /\b(discuss[es]?|discussed|meeting)\b/i,
  /\b(decide[d]?|decision[s]?)\b/i,
  /\b(implement[s]?|implemented|build[s]?|create[s]?|develop[s]?)\b/i,
  /\b(test[s]?|testing|validate[s]?)\b/i,
  /\b(document[s]?|document[a-z]+)\b/i,
  /\b(assign[s]?|assigned|owner[s]?)\b/i,
];

const TIMELINE_RE = /\b(week[s]?|month[s]?|day[s]?|deadline[s]?|due|sprint[s]?|quarter|asap|urgent|soon|by \w+day|q[1-4])\b/i;
const STAKEHOLDER_RE = /\b(user[s]?|stakeholder[s]?|team[s]?|client[s]?|customer[s]?|manager|director|owner[s]?|department)\b/i;
const SUCCESS_RE = /\b(success|successf[a-z]+|goal[s]?|objective[s]?|outcome[s]?|kpi[s]?|metric[s]?|measur[a-z]+|achiev[a-z]+)\b/i;

// ─── Tokenizer & TF-IDF ───────────────────────────────────────────────────────
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function computeTfIdf(docs) {
  const N = docs.length;
  if (N === 0) return {};

  // Term frequency per doc
  const tfDocs = docs.map(d => {
    const tokens = tokenize(d);
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    const max = Math.max(...Object.values(tf), 1);
    Object.keys(tf).forEach(t => { tf[t] = tf[t] / max; });
    return tf;
  });

  // Document frequency
  const df = {};
  tfDocs.forEach(tf => Object.keys(tf).forEach(t => { df[t] = (df[t] || 0) + 1; }));

  // TF-IDF per term across all docs
  const scores = {};
  tfDocs.forEach(tf => {
    Object.entries(tf).forEach(([t, freq]) => {
      const idf = Math.log((N + 1) / (df[t] + 1)) + 1;
      scores[t] = (scores[t] || 0) + freq * idf;
    });
  });

  return scores;
}

function topKeywords(tfidf, n = 8) {
  return Object.entries(tfidf)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term]) => term);
}

// ─── Sentence classifier ──────────────────────────────────────────────────────
function classifySentence(text) {
  const types = [];
  if (REQUIREMENT_RE.some(r => r.test(text))) types.push("requirement");
  if (CONCERN_RE.some(r => r.test(text)))    types.push("concern");
  if (ACTION_RE.some(r => r.test(text)))     types.push("action");
  return types.length ? types : ["general"];
}

function scoreImportance(text, tfidf) {
  const tokens = tokenize(text);
  const base = tokens.reduce((s, t) => s + (tfidf[t] || 0), 0);
  // Boost longer, more substantive sentences
  const lengthBonus = Math.min(text.split(" ").length / 20, 1);
  return base + lengthBonus;
}

// ─── Deduplication: remove near-duplicate sentences ──────────────────────────
function deduplicate(sentences) {
  const kept = [];
  for (const s of sentences) {
    const tokens = new Set(tokenize(s));
    const isDup = kept.some(k => {
      const kTokens = new Set(tokenize(k));
      const intersection = [...tokens].filter(t => kTokens.has(t)).length;
      const union = new Set([...tokens, ...kTokens]).size;
      return union > 0 && intersection / union > 0.65;
    });
    if (!isDup) kept.push(s);
  }
  return kept;
}

// ─── Capitalise first letter ──────────────────────────────────────────────────
function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ─── Format a message list as bullet text ────────────────────────────────────
function buildSection(messages, tfidf, types, maxItems = 5) {
  const candidates = messages.filter(m => {
    const c = classifySentence(m.message_text);
    return types.some(t => c.includes(t));
  });

  const scored = candidates.map(m => ({
    text: m.message_text,
    sender: m.sender_name,
    score: scoreImportance(m.message_text, tfidf),
  }));

  scored.sort((a, b) => b.score - a.score);

  const texts = deduplicate(scored.map(s => s.text)).slice(0, maxItems);
  return texts.map(t => cap(t.trim()));
}

// ─── BRD Readiness check ─────────────────────────────────────────────────────
function brdReadiness(messages, keywords) {
  const allText = messages.map(m => m.message_text).join(" ");
  const checks = [
    { label: "Requirements defined",   pass: REQUIREMENT_RE.some(r => r.test(allText)) },
    { label: "Stakeholders identified", pass: STAKEHOLDER_RE.test(allText) },
    { label: "Timelines mentioned",     pass: TIMELINE_RE.test(allText) },
    { label: "Success criteria present",pass: SUCCESS_RE.test(allText) },
    { label: "Risks / concerns raised", pass: CONCERN_RE.some(r => r.test(allText)) },
  ];
  const score = checks.filter(c => c.pass).length;
  let readinessLevel;
  if (score >= 5) readinessLevel = "High — ready to start BRD draft";
  else if (score >= 3) readinessLevel = "Medium — a few gaps remain";
  else readinessLevel = "Low — more discussion needed";

  return { checks, score, readinessLevel };
}

// ─── Executive summary: pick the top N highest-scoring sentences ──────────────
function executiveSummary(messages, tfidf, n = 3) {
  const scored = messages.map(m => ({
    text: m.message_text,
    score: scoreImportance(m.message_text, tfidf),
  }));
  scored.sort((a, b) => b.score - a.score);
  const top = deduplicate(scored.map(s => s.text)).slice(0, n);
  return top.map(t => cap(t.trim())).join(" ");
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * @param {Array<{message_text:string, sender_name:string, marked_at:string}>} messages
 * @param {{title:string, description:string, category:string, priority:string, status:string}} requestInfo
 * @returns {object} structured analysis
 */
export function analyseKeyPoints(messages, requestInfo) {
  if (!messages || messages.length === 0) {
    return { error: "No key points to analyse. Please mark at least one message first." };
  }

  const docs = messages.map(m => m.message_text);
  const tfidf = computeTfIdf(docs);
  const keywords = topKeywords(tfidf, 10);

  const requirements = buildSection(messages, tfidf, ["requirement"], 6);
  const concerns     = buildSection(messages, tfidf, ["concern"], 5);
  const actions      = buildSection(messages, tfidf, ["action"], 5);
  const readiness    = brdReadiness(messages, keywords);
  const summary      = executiveSummary(messages, tfidf, 3);

  // Fallback: if a section is empty, surface most relevant messages
  const generalFallback = (limit) =>
    deduplicate(
      messages
        .map(m => ({ text: m.message_text, score: scoreImportance(m.message_text, tfidf) }))
        .sort((a, b) => b.score - a.score)
        .map(s => cap(s.text.trim()))
    ).slice(0, limit);

  return {
    generated_at: new Date().toISOString(),
    request: {
      title: requestInfo.title,
      category: requestInfo.category,
      priority: requestInfo.priority,
      status: requestInfo.status,
    },
    executive_summary: summary || "Based on the marked conversation, the discussion covers the core business need for this request.",
    key_requirements: requirements.length ? requirements : generalFallback(4),
    stakeholder_concerns: concerns.length ? concerns : [],
    action_items: actions.length ? actions : [],
    keywords,
    brd_readiness: readiness,
    message_count: messages.length,
  };
}
