import styles from "../page.module.css";

export default function RoleIndex() {
  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2>Role routes</h2>
        <div className={styles.links}>
          <a href="/role/ba">BA</a>
          <a href="/role/sme">SME</a>
          <a href="/role/risk">Risk</a>
          <a href="/role/compliance">Compliance</a>
          <a href="/role/infosec">InfoSec</a>
          <a href="/role/it">IT</a>
          <a href="/role/admin">Admin</a>
        </div>
      </section>
    </div>
  );
}
