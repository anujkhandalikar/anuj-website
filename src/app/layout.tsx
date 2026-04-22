import type { Metadata } from "next";
import "./globals.css";
import { EditProvider } from "@/lib/EditContext";
import EditModeToggle from "@/components/Editor/EditModeToggle";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import ClientLogin from "@/components/Auth/ClientLogin";
import { getSidebarData } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://anujkhandalikar.vercel.app"),
  title: "Anuj Khandalikar - Builder, Writer, Runner",
  description:
    "I build products, write about interesting ideas that won't leave me alone (and run marathons). Product Manager at Flipkart. IIT Madras.",
  keywords: [
    "Anuj Khandalikar",
    "Product Manager",
    "Flipkart",
    "IIT Madras",
    "Writer",
    "Marathon Runner",
  ],
  authors: [{ name: "Anuj Khandalikar" }],
  icons: {
    icon: "/apple-notes-logo.webp",
    shortcut: "/apple-notes-logo.webp",
    apple: "/apple-notes-logo.webp",
  },
  openGraph: {
    title: "Anuj Khandalikar - Builder, Writer, Runner",
    description:
      "I build products, write about interesting ideas that won't leave me alone (and run marathons).",
    url: "https://anujkhandalikar.vercel.app",
    siteName: "Anuj Khandalikar",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anuj Khandalikar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anuj Khandalikar - Builder, Writer, Runner",
    description:
      "I build products, write about interesting ideas that won't leave me alone (and run marathons).",
    creator: "@realkhandalikar",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarPages, isAuthenticated] = await Promise.all([
    getSidebarData(),
    getSession()
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleAnalytics gaId="G-LYFZ95RMBS" />
        <ThemeProvider>
          <EditProvider>
            <div className="min-h-dvh flex bg-[var(--notes-bg)]">
              <ClientLogin isAuthenticated={isAuthenticated} />
              <Sidebar pages={sidebarPages} isAuthenticated={isAuthenticated} />
              <MobileHeader pages={sidebarPages} />
              <main className="flex-1 md:ml-[260px] min-h-dvh">
                {children}
              </main>
            </div>
            <EditModeToggle />
          </EditProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
