// Template2.tsx — Modern Minimal  
// Dark slate sidebar · Teal accents · Clean sans-serif

import React from "react";
import { ResumeData } from "../../app/resume/types";

interface Props { data: ResumeData }

export default function Template2({ data }: Props) {
  const { personal, education, experience, skills, softSkills, languages, hobbies, leadership, achievements } = data;

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        {/* Avatar placeholder */}
        <div style={s.avatar}>
          {personal.name ? personal.name[0].toUpperCase() : "?"}
        </div>

        <h1 style={s.name}>{personal.name || "Your Name"}</h1>
        {experience[0]?.role && (
          <p style={s.roleTag}>{experience[0].role}</p>
        )}

        <div style={s.contactSection}>
          {personal.email && <ContactItem icon="✉" text={personal.email} />}
          {personal.phone && <ContactItem icon="✆" text={personal.phone} />}
          {personal.address && <ContactItem icon="⌖" text={personal.address} />}
        </div>

        {skills.filter(Boolean).length > 0 && (
          <SideBlock title="Technical Skills">
            <div style={s.barGroup}>
              {skills.filter(Boolean).map((sk, i) => (
                <div key={i} style={s.skillItem}>
                  <span style={s.skillName}>{sk}</span>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: `${75 + (i % 3) * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SideBlock>
        )}

        {softSkills.filter(Boolean).length > 0 && (
          <SideBlock title="Soft Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {softSkills.filter(Boolean).map((sk, i) => (
                <span key={i} style={s.chip}>{sk}</span>
              ))}
            </div>
          </SideBlock>
        )}

        {languages.filter(Boolean).length > 0 && (
          <SideBlock title="Languages">
            {languages.filter(Boolean).map((l, i) => (
              <p key={i} style={s.sideListItem}>◆ {l}</p>
            ))}
          </SideBlock>
        )}

        {hobbies.filter(Boolean).length > 0 && (
          <SideBlock title="Hobbies">
            {hobbies.filter(Boolean).map((h, i) => (
              <p key={i} style={s.sideListItem}>◆ {h}</p>
            ))}
          </SideBlock>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        {personal.objective && (
          <Section title="Profile">
            <p style={s.paragraph}>{personal.objective}</p>
          </Section>
        )}

        {experience.filter(e => e.role || e.org).length > 0 && (
          <Section title="Work Experience">
            {experience.filter(e => e.role || e.org).map((ex, i) => (
              <div key={i} style={s.entry}>
                <div style={s.entryDot} />
                <div style={{ flex: 1 }}>
                  <div style={s.entryHead}>
                    <p style={s.entryTitle}>{ex.role}</p>
                    {(ex.start || ex.end) && (
                      <span style={s.datePill}>{ex.start}{ex.end && ` – ${ex.end}`}</span>
                    )}
                  </div>
                  <p style={s.entryOrg}>{ex.org}{ex.location && ` · ${ex.location}`}</p>
                  {ex.desc && <p style={s.paragraph}>{ex.desc}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {education.filter(e => e.institution).length > 0 && (
          <Section title="Education">
            {education.filter(e => e.institution).map((ed, i) => (
              <div key={i} style={s.entry}>
                <div style={s.entryDot} />
                <div style={{ flex: 1 }}>
                  <div style={s.entryHead}>
                    <p style={s.entryTitle}>{ed.degree}{ed.field && ` in ${ed.field}`}</p>
                    {(ed.start || ed.end) && (
                      <span style={s.datePill}>{ed.start}{ed.end && ` – ${ed.end}`}</span>
                    )}
                  </div>
                  <p style={s.entryOrg}>{ed.institution}{ed.address && ` · ${ed.address}`}</p>
                </div>
              </div>
            ))}
          </Section>
        )}

        {leadership.filter(Boolean).length > 0 && (
          <Section title="Leadership">
            <ul style={s.bulletList}>
              {leadership.filter(Boolean).map((l, i) => (
                <li key={i} style={s.bulletItem}>{l}</li>
              ))}
            </ul>
          </Section>
        )}

        {achievements.filter(Boolean).length > 0 && (
          <Section title="Achievements">
            <ul style={s.bulletList}>
              {achievements.filter(Boolean).map((a, i) => (
                <li key={i} style={s.bulletItem}>{a}</li>
              ))}
            </ul>
          </Section>
        )}
      </main>
    </div>
  );
}

function ContactItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 5 }}>
      <span style={{ color: "#0d9488", fontSize: 10, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 10, color: "#94a3b8", wordBreak: "break-all" }}>{text}</span>
    </div>
  );
}

function SideBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={s.sideHeading}>{title}</p>
      <div style={s.sideDivider} />
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={s.sectionHead}>
        <div style={s.sectionAccent} />
        <h2 style={s.sectionTitle}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    width: 794,
    minHeight: 1123,
    display: "flex",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    fontSize: 12,
    background: "#fff",
  },
  sidebar: {
    width: 220,
    background: "#0f172a",
    padding: "32px 18px",
    flexShrink: 0,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0d9488,#2563eb)",
    color: "#fff",
    fontSize: 28,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  name: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: 700,
    textAlign: "center",
    margin: "0 0 4px",
    lineHeight: 1.2,
  },
  roleTag: {
    color: "#0d9488",
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    margin: "0 0 16px",
  },
  contactSection: { marginBottom: 18, borderBottom: "1px solid #1e293b", paddingBottom: 14 },
  sideHeading: {
    color: "#0d9488",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: 700,
    margin: "0 0 5px",
  },
  sideDivider: { height: 1, background: "#1e293b", marginBottom: 8 },
  barGroup: { display: "flex", flexDirection: "column", gap: 6 },
  skillItem: {},
  skillName: { fontSize: 10, color: "#cbd5e1", display: "block", marginBottom: 2 },
  barTrack: { height: 4, background: "#1e293b", borderRadius: 2 },
  barFill: { height: "100%", background: "linear-gradient(90deg,#0d9488,#2563eb)", borderRadius: 2 },
  chip: {
    background: "#1e293b",
    color: "#94a3b8",
    borderRadius: 4,
    padding: "2px 6px",
    fontSize: 9,
  },
  sideListItem: { color: "#94a3b8", fontSize: 10, margin: "0 0 4px" },
  main: { flex: 1, padding: "32px 28px" },
  sectionHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  sectionAccent: { width: 4, height: 18, background: "#0d9488", borderRadius: 2 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: 0.5 },
  paragraph: { fontSize: 11, lineHeight: 1.7, color: "#475569", margin: 0 },
  entry: { display: "flex", gap: 10, marginBottom: 14, position: "relative" },
  entryDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#0d9488",
    flexShrink: 0,
    marginTop: 4,
  },
  entryHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
  entryTitle: { fontWeight: 700, fontSize: 12, color: "#0f172a", margin: 0 },
  datePill: {
    fontSize: 9,
    color: "#0d9488",
    background: "#f0fdfa",
    padding: "2px 6px",
    borderRadius: 4,
    border: "1px solid #ccfbf1",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  entryOrg: { fontSize: 10, color: "#64748b", margin: "0 0 4px" },
  bulletList: { margin: 0, paddingLeft: 0, listStyle: "none" },
  bulletItem: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 5,
    paddingLeft: 12,
    position: "relative",
  },
};