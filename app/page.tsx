'use client';

import styles from "./page.module.css";

const portals = [
  {
    name: "BA Portal",
    icon: "📋",
    description: "Create and manage Business Requirements Documents (BRDs) with AI-powered generation and stakeholder collaboration.",
    href: "/ba-portal",
    color: "ba",
  },
  {
    name: "Stakeholder Portal",
    icon: "👥",
    description: "Review, approve, and provide feedback on BRDs. Track approvals and collaborate with other stakeholders.",
    href: "/role/sme",
    color: "stakeholder",
  },
  {
    name: "IT Portal",
    icon: "⚙️",
    description: "Review BRD feasibility, estimate costs, plan development timelines, and track IT delivery progress.",
    href: "/role/it",
    color: "it",
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.kicker}>BRD Automation Platform</p>
          <h1>Select Your Portal</h1>
          <p className={styles.subtitle}>
            Choose your role to access the appropriate workspace for managing Business Requirements Documents.
          </p>
        </div>
      </header>

      <section className={styles.portalGrid}>
        {portals.map((portal) => (
          <a
            key={portal.name}
            href={portal.href}
            className={`${styles.portalCard} ${styles[`portal_${portal.color}`]} ${
              portal.disabled ? styles.portalDisabled : ""
            }`}
            onClick={(e) => {
              if (portal.disabled) {
                e.preventDefault();
              }
            }}
          >
            <div className={styles.portalIcon}>{portal.icon}</div>
            <h2>{portal.name}</h2>
            <p>{portal.description}</p>
            {portal.disabled && <span className={styles.comingSoon}>Coming Soon</span>}
          </a>
        ))}
      </section>
    </div>
  );
}
