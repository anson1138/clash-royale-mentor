import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

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
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-on-surface overflow-x-hidden">
        <Sidebar />
        <div className="ml-64 min-h-screen flex flex-col">
          <TopBar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
