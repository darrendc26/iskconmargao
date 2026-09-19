import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteUrl } from "@/lib/api";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "ISKCON Margao | Krishna Consciousness in South Goa",
    template: "%s | ISKCON Margao",
  },
  description:
    "ISKCON Margao is a welcoming spiritual centre in Margao, Goa. Join Friday and Saturday kirtan, Krishna Katha, prasadam and community.",
  alternates: { canonical: siteUrl("/") },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "ISKCON Margao",
    url: siteUrl("/"),
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&family=Noto+Serif+Devanagari:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-3 focus:bg-white">
          Skip to content
        </a>
        <Header />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "ISKCON Margao",
              url: siteUrl("/"),
              address: {
                "@type": "PostalAddress",
                streetAddress: "Matchless Gifts, next to Borkar Hospital",
                addressLocality: "Margao",
                postalCode: "403601",
                addressRegion: "Goa",
                addressCountry: "IN",
              },
              telephone: "+919923030936",
            }),
          }}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
