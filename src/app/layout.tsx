import "./globals.css";

import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import { AppLayout } from "@/components/layouts/AppLayout";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "7-Movies - Find 7 movies with emojis",
  description: "Play a game of guessing 7 movie titles based on emojis",
};

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--fredoka-font",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fredoka.variable}>
        <AppProvider>
          <AppLayout>{children}</AppLayout>
        </AppProvider>
      </body>
    </html>
  );
}
