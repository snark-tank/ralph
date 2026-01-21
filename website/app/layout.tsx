import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ralph's $FED Dashboard",
  description: "The Federal Reserve Money Printer - Live Progress & Research",
};

function Navigation() {
  return (
    <nav className="border-b border-[#222] bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🖨️</span>
            <div>
              <h1 className="text-xl font-bold text-[#c9a227]">Ralph&apos;s $FED</h1>
              <p className="text-xs text-gray-500">Federal Reserve Dashboard</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-400 hover:text-[#c9a227] transition-colors text-sm">
              Dashboard
            </Link>
            <Link href="/research" className="text-gray-400 hover:text-[#c9a227] transition-colors text-sm">
              Research
            </Link>
            <Link href="/roadmap" className="text-gray-400 hover:text-[#c9a227] transition-colors text-sm">
              Roadmap
            </Link>
            <Link href="/changelog" className="text-gray-400 hover:text-[#c9a227] transition-colors text-sm">
              Changelog
            </Link>
            <a
              href="https://fed.markets"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#c9a227] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e0b82a] transition-colors"
            >
              fed.markets
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#222] bg-[#0d0d0d] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>🖨️</span>
            <span>Ralph&apos;s Federal Reserve</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://x.com/fed_USD1" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a227]">
              Twitter
            </a>
            <a href="https://github.com/snark-tank/ralph" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a227]">
              GitHub
            </a>
            <a href="https://fed.markets" target="_blank" rel="noopener noreferrer" className="hover:text-[#c9a227]">
              Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
