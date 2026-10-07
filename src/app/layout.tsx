import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Lora } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const body = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const heading = Lora({
  variable: "--font-heading",
  subsets: ["vietnamese", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "bệnh viện mắt Bà Rịa",
    "bệnh viện mắt Vũng Tàu",
    "khám mắt Bà Rịa Vũng Tàu",
    "mổ cận thị Vũng Tàu",
    "ReLEx SMILE",
    "phẫu thuật Phaco",
    "đục thủy tinh thể",
    "Glôcôm",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#02421c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${body.variable} ${heading.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
