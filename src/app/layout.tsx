import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WellnessAI - AI-Powered Mental Wellness Companion",
  description:
    "Transform your mental wellness journey with AI-driven insights, mood tracking, and personalized recommendations. Start your journey to better mental health today.",
  keywords: [
    "mental health",
    "wellness",
    "AI",
    "mood tracking",
    "mindfulness",
    "mental wellness",
  ],
  authors: [{ name: "WellnessAI Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#10b981",
  openGraph: {
    title: "WellnessAI - AI-Powered Mental Wellness Companion",
    description:
      "Transform your mental wellness journey with AI-driven insights and personalized recommendations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "WellnessAI - AI-Powered Mental Wellness Companion",
    description:
      "Transform your mental wellness journey with AI-driven insights and personalized recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
