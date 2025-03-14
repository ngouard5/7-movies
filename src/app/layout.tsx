import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7-Movies - Find 7 movies with emojis",
  description: "Play a game of guessing 7 movie titles based on emojis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
