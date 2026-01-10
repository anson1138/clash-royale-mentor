import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clash Royale Mentor",
  description: "Your AI-powered Clash Royale coaching assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
