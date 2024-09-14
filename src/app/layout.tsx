import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naman Luthra - Software Engineer | Whatfix",
  description: "I am Naman Luthra, a dedicated Software Engineer from BITS Pilani, currently innovating at Whatfix. Explore my journey through AI projects, including RAG and chain of thought models, and gain insights into my professional experiences and technical skills in B2B SaaS environments. Discover my approach to problem-solving and how I apply cutting-edge technologies to drive results in the software industry.",
  icons: "/icons/nl.png"
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
