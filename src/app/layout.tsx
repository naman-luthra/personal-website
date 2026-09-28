import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-Latin.woff2",
  variable: "--font-display",
  display: "swap",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namanluthra.me"),
  title: "Naman Luthra — Software Engineer",
  description:
    "Software Engineer at Rubrik. BITS Pilani graduate. Working on UI infrastructure, developer experience, and applied AI.",
  icons: "/icon.svg",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Naman Luthra — Software Engineer",
    description:
      "Hi, I’m Naman. Software engineer at Rubrik, BITS Pilani graduate, and previously working on applied AI at Whatfix.",
    url: "https://namanluthra.me",
    siteName: "Naman Luthra",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bricolage.variable}>{children}</body>
    </html>
  );
}
