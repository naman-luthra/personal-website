import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naman Luthra",
  description: "Welcome to my digital space! I'm Naman Luthra, a passionate Computer Science Engineering student at BITS Pilani, eagerly awaiting graduation in May 2024. This website is more than just a collection of web pages; it's a reflection of my journey, experiences, and aspirations in the world of technology. Here, you'll find insights into my work experiences, skills, and education, curated to showcase my passion for innovation and problem-solving. Dive in to discover how I've leveraged cutting-edge technologies and tackled challenges in software engineering. Feel free to explore, connect, and join me on this exciting adventure in the ever-evolving realm of computer science.",
  icons: "/icons/nl.png"
};

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
