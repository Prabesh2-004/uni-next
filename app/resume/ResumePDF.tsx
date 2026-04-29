// ResumePDF.tsx — @react-pdf/renderer
// Run: npm install @react-pdf/renderer
// Usage: import { downloadResumePDF } from './ResumePDF'

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { ResumeData } from "./types";

// ─── Download helper ───────────────────────────────────────────────────────

export async function downloadResumePDF(data: ResumeData, templateId: number) {
  const doc = <ResumePDF data={data} templateId={templateId} />;
  const blob = await pdf(doc).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.personal.name || "resume"}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Router ───────────────────────────────────────────────────────────────

export function ResumePDF({ data, templateId }: { data: ResumeData; templateId: number }) {
  if (templateId === 2) return <PDF2 data={data} />;
  if (templateId === 3) return <PDF3 data={data} />;
  return <PDF1 data={data} />;
}

// ═══════════════════════════════════════════════════════════════════════════
//  PDF Template 1 — Classic Professional
// ═══════════════════════════════════════════════════════════════════════════

const t1 = StyleSheet.create({
  page: { fontFamily: "Times-Roman", fontSize: 14, color: "#1a1a2e", backgroundColor: "#fff" },
  header: { backgroundColor: "#1e3a8a", padding: "28 32 22", color: "#fff" },
  name: { fontSize: 48, fontFamily: "Helvetica-Bold", color: "#fff", letterSpacing: 0.5, marginBottom: 3 },
  roleTag: { fontSize: 14, color: "#bfdbfe", letterSpacing: 1.5, marginBottom: 10 },
  contactRow: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  contactItem: { fontSize: 14, color: "#e0e7ff" },
  body: { flexDirection: "row", flex: 1 },
  aside: { width: 170, backgroundColor: "#eff6ff", padding: "18 14", borderRight: "1 solid #e2e8f0" },
  main: { flex: 1, padding: "18 22" },
  sideHeading: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#1e40af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 },
  sideDivider: { height: 2, backgroundColor: "#2563eb", marginBottom: 7, width: 30 },
  tag: { backgroundColor: "#dbeafe", color: "#1e40af", borderRadius: 3, padding: "2 6", fontSize: 13, marginRight: 3, marginBottom: 3 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  sideText: { fontSize: 14, color: "#374151", marginBottom: 3 },
  sideSection: { marginBottom: 14 },
  mainHeading: { fontSize: 15, fontFamily: "Helvetica-Bold", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 },
  accentLine: { height: 2, width: 30, backgroundColor: "#2563eb", borderRadius: 2, marginBottom: 8 },
  mainSection: { marginBottom: 16 },
  entryBlock: { marginBottom: 10 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#1e293b" },
  entryOrg: { fontSize: 14, color: "#4b5563", marginBottom: 3 },
  datePill: { fontSize: 13, color: "#6b7280", backgroundColor: "#f1f5f9", padding: "1 5", borderRadius: 3 },
  paragraph: { fontSize: 15, lineHeight: 1.55, color: "#374151", marginTop: 5 },
  bulletItem: { fontSize: 15, color: "#374151", marginBottom: 3 },
});

function PDF1({ data }: { data: ResumeData }) {
  const { personal, education, experience, skills, softSkills, languages, hobbies, leadership, achievements } = data;
  return (
    <Document>
      <Page size="A4" style={t1.page}>
        <View style={t1.header}>
          <Text style={t1.name}>{personal.name || "Your Name"}</Text>
          {experience[0]?.role && <Text style={t1.roleTag}>{experience[0].role.toUpperCase()}</Text>}
          <View style={t1.contactRow}>
            {personal.email && <Text style={t1.contactItem}>✉ {personal.email}</Text>}
            {personal.phone && <Text style={t1.contactItem}>✆ {personal.phone}</Text>}
            {personal.address && <Text style={t1.contactItem}>⌖ {personal.address}</Text>}
          </View>
        </View>

        <View style={t1.body}>
          {/* Aside */}
          <View style={t1.aside}>
            {skills.filter(Boolean).length > 0 && (
              <View style={t1.sideSection}>
                <Text style={t1.sideHeading}>Technical Skills</Text>
                <View style={t1.sideDivider} />
                <View style={t1.tagRow}>
                  {skills.filter(Boolean).map((sk, i) => <Text key={i} style={t1.tag}>{sk}</Text>)}
                </View>
              </View>
            )}
            {softSkills.filter(Boolean).length > 0 && (
              <View style={t1.sideSection}>
                <Text style={t1.sideHeading}>Soft Skills</Text>
                <View style={t1.sideDivider} />
                {softSkills.filter(Boolean).map((sk, i) => <Text key={i} style={t1.sideText}> {sk}</Text>)}
              </View>
            )}
            {languages.filter(Boolean).length > 0 && (
              <View style={t1.sideSection}>
                <Text style={t1.sideHeading}>Languages</Text>
                <View style={t1.sideDivider} />
                {languages.filter(Boolean).map((l, i) => <Text key={i} style={t1.sideText}> {l}</Text>)}
              </View>
            )}
            {hobbies.filter(Boolean).length > 0 && (
              <View style={t1.sideSection}>
                <Text style={t1.sideHeading}>Hobbies</Text>
                <View style={t1.sideDivider} />
                {hobbies.filter(Boolean).map((h, i) => <Text key={i} style={t1.sideText}> {h}</Text>)}
              </View>
            )}
            {education.filter(e => e.institution).map((ed, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                {i === 0 && <><Text style={t1.sideHeading}>Education</Text><View style={t1.sideDivider} /></>}
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e293b" }}>{ed.degree}</Text>
                <Text style={t1.sideText}>{ed.institution}</Text>
                {(ed.start || ed.end) && <Text style={{ fontSize: 8, color: "#6b7280" }}>{ed.start}{ed.end && ` – ${ed.end}`}</Text>}
              </View>
            ))}
          </View>

          {/* Main */}
          <View style={t1.main}>
            {personal.objective && (
              <View style={t1.mainSection}>
                <Text style={t1.mainHeading}>About Me</Text>
                <View style={t1.accentLine} />
                <Text style={t1.paragraph}> - {personal.objective}</Text>
              </View>
            )}
            {experience.filter(e => e.role || e.org).length > 0 && (
              <View style={t1.mainSection}>
                <Text style={t1.mainHeading}>Experience</Text>
                <View style={t1.accentLine} />
                {experience.filter(e => e.role || e.org).map((ex, i) => (
                  <View key={i} style={t1.entryBlock}>
                    <View style={t1.entryRow}>
                      <Text style={t1.entryTitle}>{ex.role}</Text>
                      {(ex.start || ex.end) && <Text style={t1.datePill}>{ex.start}{ex.end && ` – ${ex.end}`}</Text>}
                    </View>
                    <Text style={t1.entryOrg}>{ex.org}{ex.location && ` · ${ex.location}`}</Text>
                    {ex.desc && <Text style={t1.paragraph}> - {ex.desc}</Text>}
                  </View>
                ))}
              </View>
            )}
            {leadership.filter(Boolean).length > 0 && (
              <View style={t1.mainSection}>
                <Text style={t1.mainHeading}>Leadership</Text>
                <View style={t1.accentLine} />
                {leadership.filter(Boolean).map((l, i) => <Text key={i} style={t1.bulletItem}>• {l}</Text>)}
              </View>
            )}
            {achievements.filter(Boolean).length > 0 && (
              <View style={t1.mainSection}>
                <Text style={t1.mainHeading}>Achievements</Text>
                <View style={t1.accentLine} />
                {achievements.filter(Boolean).map((a, i) => <Text key={i} style={t1.bulletItem}>• {a}</Text>)}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PDF Template 2 — Modern Dark Sidebar
// ═══════════════════════════════════════════════════════════════════════════

const t2 = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica", fontSize: 10, backgroundColor: "#fff" },
  sidebar: { width: 175, backgroundColor: "#0f172a", padding: "28 14" },
  avatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: "#0d9488", marginBottom: 10, alignSelf: "center", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 22, fontFamily: "Helvetica-Bold" },
  sName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#f8fafc", textAlign: "center", marginBottom: 3, lineHeight: 1.2 },
  sRole: { fontSize: 8, color: "#0d9488", textAlign: "center", letterSpacing: 1.5, marginBottom: 12 },
  sContactItem: { fontSize: 8.5, color: "#94a3b8", marginBottom: 4 },
  sDivider: { height: 1, backgroundColor: "#1e293b", marginBottom: 7 },
  sSectionTitle: { fontSize: 8, color: "#0d9488", textTransform: "uppercase", letterSpacing: 1.8, fontFamily: "Helvetica-Bold", marginBottom: 5 },
  sSec: { marginBottom: 14 },
  sText: { fontSize: 9, color: "#94a3b8", marginBottom: 3 },
  sChip: { backgroundColor: "#1e293b", color: "#94a3b8", borderRadius: 3, padding: "2 5", fontSize: 8, marginRight: 3, marginBottom: 3 },
  sChipRow: { flexDirection: "row", flexWrap: "wrap" },
  main: { flex: 1, padding: "28 22" },
  secHead: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  secAccent: { width: 3, height: 14, backgroundColor: "#0d9488", borderRadius: 2 },
  secTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  mainSec: { marginBottom: 16 },
  entryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  entryTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  entryOrg: { fontSize: 9, color: "#64748b", marginBottom: 3 },
  datePill: { fontSize: 8, color: "#0d9488", backgroundColor: "#f0fdfa", padding: "1 5", borderRadius: 3 },
  para: { fontSize: 9, lineHeight: 1.6, color: "#475569" },
  bullet: { fontSize: 9, color: "#475569", marginBottom: 3 },
});

function PDF2({ data }: { data: ResumeData }) {
  const { personal, education, experience, skills, softSkills, languages, hobbies, leadership, achievements } = data;
  const initial = personal.name ? personal.name[0].toUpperCase() : "?";
  return (
    <Document>
      <Page size="A4" style={t2.page}>
        <View style={t2.sidebar}>
          <View style={t2.avatar}><Text style={t2.avatarText}>{initial}</Text></View>
          <Text style={t2.sName}>{personal.name || "Your Name"}</Text>
          {experience[0]?.role && <Text style={t2.sRole}>{experience[0].role.toUpperCase()}</Text>}
          <View style={{ borderBottom: "1 solid #1e293b", paddingBottom: 10, marginBottom: 12 }}>
            {personal.email && <Text style={t2.sContactItem}>✉ {personal.email}</Text>}
            {personal.phone && <Text style={t2.sContactItem}>✆ {personal.phone}</Text>}
            {personal.address && <Text style={t2.sContactItem}>⌖ {personal.address}</Text>}
          </View>
          {skills.filter(Boolean).length > 0 && (
            <View style={t2.sSec}>
              <Text style={t2.sSectionTitle}>Technical Skills</Text>
              <View style={t2.sDivider} />
              {skills.filter(Boolean).map((sk, i) => <Text key={i} style={t2.sText}>• {sk}</Text>)}
            </View>
          )}
          {softSkills.filter(Boolean).length > 0 && (
            <View style={t2.sSec}>
              <Text style={t2.sSectionTitle}>Soft Skills</Text>
              <View style={t2.sDivider} />
              <View style={t2.sChipRow}>
                {softSkills.filter(Boolean).map((sk, i) => <Text key={i} style={t2.sChip}>{sk}</Text>)}
              </View>
            </View>
          )}
          {languages.filter(Boolean).length > 0 && (
            <View style={t2.sSec}>
              <Text style={t2.sSectionTitle}>Languages</Text>
              <View style={t2.sDivider} />
              {languages.filter(Boolean).map((l, i) => <Text key={i} style={t2.sText}>◆ {l}</Text>)}
            </View>
          )}
          {hobbies.filter(Boolean).length > 0 && (
            <View style={t2.sSec}>
              <Text style={t2.sSectionTitle}>Hobbies</Text>
              <View style={t2.sDivider} />
              {hobbies.filter(Boolean).map((h, i) => <Text key={i} style={t2.sText}>◆ {h}</Text>)}
            </View>
          )}
        </View>

        <View style={t2.main}>
          {personal.objective && (
            <View style={t2.mainSec}>
              <View style={t2.secHead}><View style={t2.secAccent} /><Text style={t2.secTitle}>Profile</Text></View>
              <Text style={t2.para}>{personal.objective}</Text>
            </View>
          )}
          {experience.filter(e => e.role || e.org).length > 0 && (
            <View style={t2.mainSec}>
              <View style={t2.secHead}><View style={t2.secAccent} /><Text style={t2.secTitle}>Work Experience</Text></View>
              {experience.filter(e => e.role || e.org).map((ex, i) => (
                <View key={i} style={{ marginBottom: 10 }}>
                  <View style={t2.entryRow}>
                    <Text style={t2.entryTitle}>{ex.role}</Text>
                    {(ex.start || ex.end) && <Text style={t2.datePill}>{ex.start}{ex.end && ` – ${ex.end}`}</Text>}
                  </View>
                  <Text style={t2.entryOrg}>{ex.org}{ex.location && ` · ${ex.location}`}</Text>
                  {ex.desc && <Text style={t2.para}>{ex.desc}</Text>}
                </View>
              ))}
            </View>
          )}
          {education.filter(e => e.institution).length > 0 && (
            <View style={t2.mainSec}>
              <View style={t2.secHead}><View style={t2.secAccent} /><Text style={t2.secTitle}>Education</Text></View>
              {education.filter(e => e.institution).map((ed, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <View style={t2.entryRow}>
                    <Text style={t2.entryTitle}>{ed.degree}{ed.field && ` in ${ed.field}`}</Text>
                    {(ed.start || ed.end) && <Text style={t2.datePill}>{ed.start}{ed.end && ` – ${ed.end}`}</Text>}
                  </View>
                  <Text style={t2.entryOrg}>{ed.institution}{ed.address && ` · ${ed.address}`}</Text>
                </View>
              ))}
            </View>
          )}
          {leadership.filter(Boolean).length > 0 && (
            <View style={t2.mainSec}>
              <View style={t2.secHead}><View style={t2.secAccent} /><Text style={t2.secTitle}>Leadership</Text></View>
              {leadership.filter(Boolean).map((l, i) => <Text key={i} style={t2.bullet}>• {l}</Text>)}
            </View>
          )}
          {achievements.filter(Boolean).length > 0 && (
            <View style={t2.mainSec}>
              <View style={t2.secHead}><View style={t2.secAccent} /><Text style={t2.secTitle}>Achievements</Text></View>
              {achievements.filter(Boolean).map((a, i) => <Text key={i} style={t2.bullet}>• {a}</Text>)}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  PDF Template 3 — Bold Executive
// ═══════════════════════════════════════════════════════════════════════════

const t3 = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a", backgroundColor: "#fff", padding: "0 0 32 0" },
  nameBlock: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", padding: "32 40 18" },
  name: { fontSize: 30, fontFamily: "Helvetica-Bold", color: "#0f172a", letterSpacing: -0.5 },
  jobTitle: { fontSize: 11, color: "#dc2626", fontFamily: "Helvetica-Bold", marginTop: 4 },
  contactLine: { fontSize: 9, color: "#6b7280", marginBottom: 2, textAlign: "right" },
  thickRule: { height: 4, backgroundColor: "#dc2626", marginHorizontal: 40, marginBottom: 2 },
  thinRule: { height: 1, backgroundColor: "#f1f5f9", marginHorizontal: 40, marginBottom: 20 },
  content: { paddingHorizontal: 40 },
  row: { flexDirection: "row", borderBottom: "1 solid #f1f5f9", paddingBottom: 14, marginBottom: 14 },
  labelCol: { width: 110, paddingTop: 1 },
  labelText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#dc2626", textTransform: "uppercase", letterSpacing: 1.8 },
  mainCol: { flex: 1 },
  lead: { fontSize: 10, lineHeight: 1.7, color: "#374151", borderLeft: "2 solid #dc2626", paddingLeft: 8 },
  expBlock: { marginBottom: 10 },
  expHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  expAt: { fontSize: 10, color: "#6b7280" },
  expDate: { fontSize: 9, color: "#dc2626", fontFamily: "Helvetica-Bold" },
  expLoc: { fontSize: 9, color: "#9ca3af", marginBottom: 3 },
  desc: { fontSize: 9, lineHeight: 1.6, color: "#4b5563" },
  pill: { backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: 3, padding: "2 7", fontSize: 9, marginRight: 4, marginBottom: 4 },
  pillRow: { flexDirection: "row", flexWrap: "wrap" },
  groupLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  bullet: { fontSize: 9, color: "#4b5563", marginBottom: 4 },
});

function PDF3({ data }: { data: ResumeData }) {
  const { personal, education, experience, skills, softSkills, languages, hobbies, leadership, achievements } = data;
  return (
    <Document>
      <Page size="A4" style={t3.page}>
        <View style={t3.nameBlock}>
          <View>
            <Text style={t3.name}>{personal.name || "Your Name"}</Text>
            {experience[0]?.role && <Text style={t3.jobTitle}>{experience[0].role}</Text>}
          </View>
          <View>
            {personal.email && <Text style={t3.contactLine}>✉ {personal.email}</Text>}
            {personal.phone && <Text style={t3.contactLine}>✆ {personal.phone}</Text>}
            {personal.address && <Text style={t3.contactLine}>⌖ {personal.address}</Text>}
          </View>
        </View>
        <View style={t3.thickRule} /><View style={t3.thinRule} />

        <View style={t3.content}>
          {personal.objective && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Executive Summary</Text></View>
              <View style={t3.mainCol}><Text style={t3.lead}>{personal.objective}</Text></View>
            </View>
          )}
          {experience.filter(e => e.role || e.org).length > 0 && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Career History</Text></View>
              <View style={t3.mainCol}>
                {experience.filter(e => e.role || e.org).map((ex, i) => (
                  <View key={i} style={t3.expBlock}>
                    <View style={t3.expHead}>
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        <Text style={t3.expRole}>{ex.role}</Text>
                        {ex.org && <Text style={t3.expAt}> @ {ex.org}</Text>}
                      </View>
                      {(ex.start || ex.end) && <Text style={t3.expDate}>{ex.start}{ex.end && ` – ${ex.end}`}</Text>}
                    </View>
                    {ex.location && <Text style={t3.expLoc}>{ex.location}</Text>}
                    {ex.desc && <Text style={t3.desc}>{ex.desc}</Text>}
                  </View>
                ))}
              </View>
            </View>
          )}
          {education.filter(e => e.institution).length > 0 && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Education</Text></View>
              <View style={t3.mainCol}>
                {education.filter(e => e.institution).map((ed, i) => (
                  <View key={i} style={{ marginBottom: 8 }}>
                    <View style={t3.expHead}>
                      <Text style={t3.expRole}>{ed.degree}{ed.field && ` — ${ed.field}`}</Text>
                      {(ed.start || ed.end) && <Text style={t3.expDate}>{ed.start}{ed.end && ` – ${ed.end}`}</Text>}
                    </View>
                    <Text style={t3.expLoc}>{ed.institution}{ed.address && `, ${ed.address}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {(skills.filter(Boolean).length > 0 || softSkills.filter(Boolean).length > 0) && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Skills</Text></View>
              <View style={t3.mainCol}>
                {skills.filter(Boolean).length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={t3.groupLabel}>Technical</Text>
                    <View style={t3.pillRow}>{skills.filter(Boolean).map((sk, i) => <Text key={i} style={t3.pill}>{sk}</Text>)}</View>
                  </View>
                )}
                {softSkills.filter(Boolean).length > 0 && (
                  <View>
                    <Text style={t3.groupLabel}>Interpersonal</Text>
                    <View style={t3.pillRow}>{softSkills.filter(Boolean).map((sk, i) => <Text key={i} style={{ ...t3.pill, backgroundColor: "#fff7ed", color: "#c2410c" }}>{sk}</Text>)}</View>
                  </View>
                )}
              </View>
            </View>
          )}
          {leadership.filter(Boolean).length > 0 && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Leadership</Text></View>
              <View style={t3.mainCol}>{leadership.filter(Boolean).map((l, i) => <Text key={i} style={t3.bullet}>• {l}</Text>)}</View>
            </View>
          )}
          {achievements.filter(Boolean).length > 0 && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Achievements</Text></View>
              <View style={t3.mainCol}>{achievements.filter(Boolean).map((a, i) => <Text key={i} style={t3.bullet}>• {a}</Text>)}</View>
            </View>
          )}
          {(languages.filter(Boolean).length > 0 || hobbies.filter(Boolean).length > 0) && (
            <View style={t3.row}>
              <View style={t3.labelCol}><Text style={t3.labelText}>Other</Text></View>
              <View style={t3.mainCol}>
                {languages.filter(Boolean).length > 0 && (
                  <View style={{ marginBottom: 8 }}>
                    <Text style={t3.groupLabel}>Languages</Text>
                    {languages.filter(Boolean).map((l, i) => <Text key={i} style={t3.bullet}>• {l}</Text>)}
                  </View>
                )}
                {hobbies.filter(Boolean).length > 0 && (
                  <View>
                    <Text style={t3.groupLabel}>Hobbies</Text>
                    {hobbies.filter(Boolean).map((h, i) => <Text key={i} style={t3.bullet}>• {h}</Text>)}
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}