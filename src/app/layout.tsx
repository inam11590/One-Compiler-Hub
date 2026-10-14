import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "OneCompilerHub — Online Programming Compiler & Developer Playground",
  description:
    "Write, experiment, and explore 18 programming languages, web stacks, and databases in one modern, browser-based developer workspace.",
  keywords: [
    "online compiler",
    "developer playground",
    "code editor",
    "Python",
    "JavaScript",
    "HTML",
    "Java",
    "C++",
    "FastAPI",
    "Monaco Editor",
    "OneCompilerHub",
  ],
  authors: [{ name: "OneCompilerHub Team" }],
  openGraph: {
    title: "OneCompilerHub — Online Programming Compiler & Developer Playground",
    description:
      "Write, experiment, and explore 18 programming languages, web stacks, and databases in one modern online coding workspace.",
    type: "website",
    locale: "en_US",
    siteName: "OneCompilerHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneCompilerHub — Online Programming Compiler & Developer Playground",
    description:
      "Write, experiment, and explore 18 programming languages in one modern developer workspace.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F19" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 selection:bg-brand-500/20 selection:text-brand-600 dark:selection:text-brand-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
