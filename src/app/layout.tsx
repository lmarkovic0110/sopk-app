import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
  title: "SOPK Quiz App",
  description: "Pub quiz management and team signup platform",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--surface)] text-[var(--foreground)]">
        <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--header-bg)]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="SOPK logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-md object-cover ring-2 ring-[var(--primary)]/25"
              />
              <Link href="/" className="text-lg font-bold tracking-tight">
                SOPK Quiz Hub
              </Link>
            </div>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link href="/quiz" className="text-[var(--muted)] hover:text-[var(--foreground)]">
                Quizzes
              </Link>
              <Link
                href="/categories"
                className="text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Categories
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <button className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--surface-soft)]">
                Log in
              </button>
              <button className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105">
                Sign up
              </button>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-73px)]">{children}</div>
      </body>
    </html>
  );
}
