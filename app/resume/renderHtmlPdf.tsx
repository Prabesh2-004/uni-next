import React from "react";
import { Text, View } from "@react-pdf/renderer";

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, "").trim();
}

export function renderPdfHtml(html: string, styles: any) {
  if (!html) return null;

  // Clean up HTML - remove empty tags
  html = html
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/<strong>(.*?)<\/strong>/g, "$1")
    .replace(/<em>(.*?)<\/em>/g, "$1")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "")
    .replace(/<li>/g, "• ")
    .replace(/<\/li>/g, "\n")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "");

  // Extract list items
  const listMatches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];

  if (listMatches.length > 0) {
    return (
      <View style={{ marginTop: 2 }}>
        {listMatches.map((match, idx) => {
          const itemHtml = match[1];
          const clean = stripHtml(itemHtml);
          if (!clean) return null;

          // Check if the ENTIRE item is bold or italic
          const hasFullBold = itemHtml.startsWith("<strong>") || itemHtml.startsWith("<b>");
          const hasFullItalic = itemHtml.startsWith("<em>") || itemHtml.startsWith("<i>");

          // Check if there are inline styles
          const hasInlineBold = itemHtml.includes("<strong>") || itemHtml.includes("<b>");
          const hasInlineItalic = itemHtml.includes("<em>") || itemHtml.includes("<i>");

          let fontFamily = "Times-Roman";
          if (hasFullBold && hasFullItalic) fontFamily = "Times-BoldItalic";
          else if (hasFullBold) fontFamily = "Helvetica-Bold";
          else if (hasFullItalic) fontFamily = "Times-Italic";

          // If there are inline styles, we need to parse the HTML properly
          if (hasInlineBold || hasInlineItalic) {
            // Split by inline tags
            const parts = itemHtml.split(/(<strong>.*?<\/strong>|<b>.*?<\/b>|<em>.*?<\/em>|<i>.*?<\/i>)/g);

            return (
              <View
                key={`li-${idx}`}
                style={{
                  flexDirection: "row",
                  marginBottom: 2,
                }}
              >
                <Text
                  style={{
                    marginRight: 5,
                    marginTop: 1, // Fix dot alignment
                    fontSize: 10,
                    color: "#374151",
                    fontFamily: "Times-Roman",
                  }}
                >
                  •
                </Text>
                <Text
                  style={{
                    ...styles,
                    flex: 1,
                    lineHeight: 1.35,
                    fontFamily: "Times-Roman",
                  }}
                >
                  {parts.map((part, i) => {
                    // Bold
                    if (part.startsWith("<strong>") || part.startsWith("<b>")) {
                      return (
                        <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>
                          {stripHtml(part)}
                        </Text>
                      );
                    }
                    // Italic
                    if (part.startsWith("<em>") || part.startsWith("<i>")) {
                      return (
                        <Text key={i} style={{ fontFamily: "Times-Italic" }}>
                          {stripHtml(part)}
                        </Text>
                      );
                    }
                    // Normal text
                    return (
                      <Text key={i} style={{ fontFamily: "Times-Roman" }}>
                        {part}
                      </Text>
                    );
                  })}
                </Text>
              </View>
            );
          }

          // Full line styling (no inline styles)
          return (
            <View
              key={`li-${idx}`}
              style={{
                flexDirection: "row",
                marginBottom: 2,
              }}
            >
              <Text
                style={{
                  marginRight: 5,
                  marginTop: 1, // Fix dot alignment
                  fontSize: 10,
                  color: "#374151",
                  fontFamily: "Times-Roman",
                }}
              >
                •
              </Text>
              <Text
                style={{
                  ...styles,
                  flex: 1,
                  lineHeight: 1.35,
                  fontFamily: fontFamily,
                }}
              >
                {clean}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  // If no list items found, process paragraphs normally
  const paragraphMatches = [...html.matchAll(/<p>([\s\S]*?)<\/p>/g)];

  const paragraphs = paragraphMatches
    .map(match => match[1].trim())
    .filter(p => p && !p.includes("<li>") && !p.includes("<ul>") && !p.includes("<ol>"));

  // If no paragraphs found but there's text content, create one
  if (paragraphs.length === 0 && html.trim()) {
    const cleanText = stripHtml(html);
    if (cleanText) {
      return (
        <Text style={{ ...styles, marginBottom: 3, lineHeight: 1.35, fontFamily: "Times-Roman" }}>
          {cleanText}
        </Text>
      );
    }
    return null;
  }

  return (
    <View style={{ marginTop: 2 }}>
      {paragraphs.map((p, idx) => {
        const parts = p.split(/(<strong>.*?<\/strong>|<b>.*?<\/b>|<em>.*?<\/em>|<i>.*?<\/i>)/g);

        return (
          <Text
            key={idx}
            style={{
              ...styles,
              marginBottom: 3,
              lineHeight: 1.35,
              fontFamily: "Times-Roman",
            }}
          >
            {parts.map((part, i) => {
              if (part.startsWith("<strong>") || part.startsWith("<b>")) {
                return (
                  <Text key={i} style={{ fontFamily: "Helvetica-Bold" }}>
                    {stripHtml(part)}
                  </Text>
                );
              }
              if (part.startsWith("<em>") || part.startsWith("<i>")) {
                return (
                  <Text key={i} style={{ fontFamily: "Times-Italic" }}>
                    {stripHtml(part)}
                  </Text>
                );
              }
              return (
                <Text key={i} style={{ fontFamily: "Times-Roman" }}>
                  {stripHtml(part)}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </View>
  );
}