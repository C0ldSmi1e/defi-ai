import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "NGMG - The Ultimate On-Chain Crypto Intel Hub",
  description: "NGMG is your alpha weapon—an elite network of DeFi AI agents tracking the entire crypto landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased bg-gradient-to-b from-black via-gray-900 to-gray-800 min-h-screen text-white"}>
        <main className="max-w-7xl mx-auto flex flex-col gap-4 justify-center items-center">
          <Navbar />
          <div className="max-w-6xl w-full flex flex-col gap-4 justify-center items-center">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
