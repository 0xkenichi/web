import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./components/Toast";
import { ErrorBoundary } from "./components/ErrorBoundary";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verba - Say it better, in any language",
  description: "Messages that land. Rewrite, translate, and blend cultural context so messages land clearly and respectfully.",
  keywords: ["AI", "translation", "message enhancement", "conversation coach", "cultural context"],
  authors: [{ name: "Verba" }],
  icons: {
    icon: [
      { url: "/verba-favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/verba-favicon_64.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/verba-icon.svg", sizes: "any" },
    ],
  },
  openGraph: {
    title: "Verba - Say it better, in any language",
    description: "Messages that land. Rewrite, translate, and blend cultural context so messages land clearly and respectfully.",
    type: "website",
    images: [
      {
        url: "/verba-social-header-1500x500.png",
        width: 1500,
        height: 500,
        alt: "Verba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verba - Say it better, in any language",
    description: "Messages that land. Rewrite, translate, and blend cultural context so messages land clearly and respectfully.",
    images: ["/verba-social-header-1500x500.png"],
  },
};

import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className={`flex flex-col min-h-screen ${inter.className}`}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
