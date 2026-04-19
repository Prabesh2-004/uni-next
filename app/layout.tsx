import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { ClientNavbar } from "@/components/client-navbar";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Dream Uni",
    template: "%s | Dream Uni"
  },
  description: "Your one stop solution for all your university needs, CV Builder, University Finder, Event Finder, Strategy Hub, and more.",
  keywords: ["dream uni", "university", "cv builder", "university finder", "event", "strategy hub", "resume", "cv-builder", "cv", "resume-builder", "resume builder", "cv builder", "free resume builder", "cv maker", "resume maker", "free cv builder", "free resume maker", "free cv maker", "free resume maker", "ai resume builder", "ai cv builder", "ai resume maker", "ai cv maker", "ai resume maker"]
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientNavbar />
          <div className="pt-16">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
