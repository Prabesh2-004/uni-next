// Template1.tsx — Classic Professional
// Two-column layout · Blue gradient header · Serif accents

import React from "react";
import { ResumeData } from "../../app/resume/types";

interface Props {
  data: ResumeData;
}

export default function Template1({ data }: Props) {
  const { personal, education, experience, skills, softSkills, languages, hobbies, leadership, achievements } = data;

  return (
    <div style={s.root}>
      {/* ── Header ── */}
      <header style={s.header}>
        <h1 style={s.name}>{personal.name || "Your Name"}</h1>
        {experience[0]?.role && <p style={s.role}>{experience[0].role}</p>}
        <div style={s.contactRow}>
          {personal.email && <span style={s.contact}>✉ {personal.email}</span>}
          {personal.phone && <span style={s.contact}>✆ {personal.phone}</span>}
          {personal.address && <span style={s.contact}>⌖ {personal.address}</span>}
        </div>
      </header>

      {/* ── Body ── */}
      <div style={s.body}>
        {/* ── Left column ── */}
        <aside style={s.aside}>
          {skills.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.sideHeading}>Technical Skills</h2>
              <div style={s.divider} />
              <ul style={s.tagList}>
                {skills.filter(Boolean).map((sk, i) => (
                  <li key={i} style={s.tag}>{sk}</li>
                ))}
              </ul>
            </section>
          )}

          {softSkills.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.sideHeading}>Soft Skills</h2>
              <div style={s.divider} />
              <ul style={s.tagList}>
                {softSkills.filter(Boolean).map((sk, i) => (
                  <li key={i} style={{ ...s.tag, background: "#dbeafe", color: "#1e40af" }}>{sk}</li>
                ))}
              </ul>
            </section>
          )}

          {languages.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.sideHeading}>Languages</h2>
              <div style={s.divider} />
              <ul style={s.plainList}>
                {languages.filter(Boolean).map((l, i) => (
                  <li key={i} style={s.plainItem}>▸ {l}</li>
                ))}
              </ul>
            </section>
          )}

          {hobbies.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.sideHeading}>Hobbies</h2>
              <div style={s.divider} />
              <ul style={s.plainList}>
                {hobbies.filter(Boolean).map((h, i) => (
                  <li key={i} style={s.plainItem}>▸ {h}</li>
                ))}
              </ul>
            </section>
          )}

          {education.filter(e => e.institution).length > 0 && (
            <section style={s.section}>
              <h2 style={s.sideHeading}>Education</h2>
              <div style={s.divider} />
              {education.filter(e => e.institution).map((ed, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <p style={s.sideTitle}>{ed.degree} {ed.field && `in ${ed.field}`}</p>
                  <p style={s.sideOrg}>{ed.institution}</p>
                  {ed.address && <p style={s.sideMeta}>{ed.address}</p>}
                  {(ed.start || ed.end) && (
                    <p style={s.sideMeta}>{ed.start}{ed.end && ` – ${ed.end}`}</p>
                  )}
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* ── Right column ── */}
        <main style={s.main}>
          {personal.objective && (
            <section style={s.section}>
              <h2 style={s.mainHeading}>About Me</h2>
              <div style={s.accentBar} />
              <p style={s.paragraph}>{personal.objective}</p>
            </section>
          )}

          {experience.filter(e => e.role || e.org).length > 0 && (
            <section style={s.section}>
              <h2 style={s.mainHeading}>Experience</h2>
              <div style={s.accentBar} />
              {experience.filter(e => e.role || e.org).map((ex, i) => (
                <div key={i} style={s.entryBlock}>
                  <div style={s.entryHeader}>
                    <div>
                      <p style={s.entryTitle}>{ex.role}</p>
                      <p style={s.entryOrg}>{ex.org}{ex.location && ` · ${ex.location}`}</p>
                    </div>
                    {(ex.start || ex.end) && (
                      <span style={s.entryDate}>{ex.start}{ex.end && ` – ${ex.end}`}</span>
                    )}
                  </div>
                  {ex.desc && <p style={s.paragraph}>{ex.desc}</p>}
                </div>
              ))}
            </section>
          )}

          {leadership.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.mainHeading}>Leadership</h2>
              <div style={s.accentBar} />
              <ul style={s.bulletList}>
                {leadership.filter(Boolean).map((l, i) => (
                  <li key={i} style={s.bulletItem}>{l}</li>
                ))}
              </ul>
            </section>
          )}

          {achievements.filter(Boolean).length > 0 && (
            <section style={s.section}>
              <h2 style={s.mainHeading}>Achievements</h2>
              <div style={s.accentBar} />
              <ul style={s.bulletList}>
                {achievements.filter(Boolean).map((a, i) => (
                  <li key={i} style={s.bulletItem}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    width: 794,
    minHeight: 1123,
    background: "#fff",
    fontFamily: "'Georgia', serif",
    fontSize: 12,
    color: "#1a1a2e",
  },
  header: {
    background: "linear-gradient(135deg,#1e3a8a 0%,#2563eb 100%)",
    color: "#fff",
    padding: "36px 40px 28px",
    textAlign: "center",
  },
  name: {
    fontFamily: "'Georgia', serif",
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: 1,
    margin: 0,
  },
  role: {
    fontSize: 14,
    opacity: 0.85,
    marginTop: 4,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  contactRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 20,
    marginTop: 12,
  },
  contact: { fontSize: 11, opacity: 0.9 },
  body: {
    display: "flex",
    minHeight: 900,
  },
  aside: {
    width: 220,
    background: "#f0f4ff",
    padding: "24px 18px",
    borderRight: "1px solid #e2e8f0",
    flexShrink: 0,
  },
  main: {
    flex: 1,
    padding: "24px 28px",
  },
  section: { marginBottom: 22 },
  sideHeading: {
    fontSize: 10,
    fontFamily: "'Arial', sans-serif",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    color: "#1e40af",
    fontWeight: 700,
    margin: "0 0 4px",
  },
  divider: {
    height: 2,
    background: "linear-gradient(90deg,#2563eb,transparent)",
    borderRadius: 2,
    marginBottom: 8,
  },
  mainHeading: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e3a8a",
    fontFamily: "'Georgia', serif",
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  accentBar: {
    height: 3,
    width: 40,
    background: "#2563eb",
    borderRadius: 2,
    marginBottom: 12,
  },
  tagList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
  },
  tag: {
    background: "#eff6ff",
    color: "#1e40af",
    borderRadius: 4,
    padding: "2px 7px",
    fontSize: 10,
    border: "1px solid #bfdbfe",
  },
  plainList: { listStyle: "none", padding: 0, margin: 0 },
  plainItem: { fontSize: 11, color: "#374151", marginBottom: 3 },
  sideTitle: { fontWeight: 700, fontSize: 11, margin: "0 0 1px", color: "#1e293b" },
  sideOrg: { fontSize: 11, color: "#374151", margin: 0 },
  sideMeta: { fontSize: 10, color: "#6b7280", margin: 0 },
  paragraph: { fontSize: 11.5, lineHeight: 1.65, color: "#374151", margin: 0 },
  entryBlock: { marginBottom: 14 },
  entryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  entryTitle: { fontWeight: 700, fontSize: 12.5, margin: 0, color: "#1e293b" },
  entryOrg: { fontSize: 11, color: "#4b5563", margin: 0 },
  entryDate: {
    fontSize: 10,
    color: "#6b7280",
    background: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: 4,
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  bulletList: { paddingLeft: 0, margin: 0, listStyle: "none" },
  bulletItem: {
    fontSize: 11.5,
    color: "#374151",
    marginBottom: 4,
    paddingLeft: 14,
    position: "relative",
  },
};