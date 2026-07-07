import type { Metadata } from "next";
import { Inter, Geist, Playfair_Display, Bodoni_Moda, Plus_Jakarta_Sans, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { getLocale, getDictionary } from "@/i18n";
import { I18nProvider } from "@/i18n/context";
import { Analytics } from "@vercel/analytics/next";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});
const notoGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | MultiStore",
    default: "MultiStore",
  },
  description: "The multi vendor ecommerce platform",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  icons: {
    icon: [
      { url: "/favicon/multistore-monochrome-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/multistore-monochrome-64.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon/multistore-monochrome-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon/multistore-monochrome-192.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("font-sans", geist.variable, playfair.variable, bodoni.variable, jakarta.variable, notoGeorgian.variable)}
    >
      <body className={inter.className}>
        <I18nProvider dict={dict} locale={locale}>
          {children}
        </I18nProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
