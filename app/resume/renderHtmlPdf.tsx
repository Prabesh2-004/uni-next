import React from "react";
import { Text, View } from "@react-pdf/renderer";

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function renderPdfHtml(html: string, styles: any) {
  if (!html) return null;

  // Check for list items BEFORE any mutation
  const listMatches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];

  if (listMatches.length > 0) {
    return (
      <View style={{ marginTop: 2 }}>
        {listMatches.map((match, idx) => {
          const itemHtml = match[1];
          const parts = itemHtml.split(
            /(<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|<em>[\s\S]*?<\/em>|<i>[\s\S]*?<\/i>)/g
          );
          return (
            <View key={`li-${idx}`} style={{ flexDirection: "row", marginBottom: 2 }}>
              <Text style={{ marginRight: 5, marginTop: 1, fontSize: 10, color: "#374151", fontFamily: "Times-Roman" }}>
                •
              </Text>
              <Text style={{ ...styles, flex: 1, lineHeight: 1.35, fontFamily: "Times-Roman" }}>
                {parts.map((part, i) => {
                  if (part.match(/^<(strong|b)>/))
                    return <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>{stripHtml(part)}</Text>;
                  if (part.match(/^<(em|i)>/))
                    return <Text key={i} style={{ fontFamily: "Times-Italic" }}>{stripHtml(part)}</Text>;
                  return <Text key={i} style={{ fontFamily: "Times-Roman" }}>{stripHtml(part)}</Text>;
                })}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  // No list — handle paragraphs
  const cleanHtml = html.replace(/<p>/g, "").replace(/<\/p>/g, "\n").replace(/<br\s*\/?>/g, "\n");
  const paragraphs = cleanHtml.split("\n").map(p => p.trim()).filter(Boolean);

  return (
    <View style={{ marginTop: 2 }}>
      {paragraphs.map((p, idx) => {
        const parts = p.split(
          /(<strong>[\s\S]*?<\/strong>|<b>[\s\S]*?<\/b>|<em>[\s\S]*?<\/em>|<i>[\s\S]*?<\/i>)/g
        );
        return (
          <Text key={idx} style={{ ...styles, marginBottom: 3, lineHeight: 1.35, fontFamily: "Times-Roman" }}>
            {parts.map((part, i) => {
              if (part.match(/^<(strong|b)>/))
                return <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>{stripHtml(part)}</Text>;
              if (part.match(/^<(em|i)>/))
                return <Text key={i} style={{ fontFamily: "Times-Italic" }}>{stripHtml(part)}</Text>;
              return <Text key={i} style={{ fontFamily: "Times-Roman" }}>{stripHtml(part)}</Text>;
            })}
          </Text>
        );
      })}
    </View>
  );
}