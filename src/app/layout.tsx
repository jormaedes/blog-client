import type { Metadata } from "next";
import AuthInitializer from "@/components/AuthInitializer";
import ThemeProvider from "@/components/ThemeProvider";
import SiteChrome from "@/components/SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Editorial — Blog de Artigos, Ideias e Histórias",
    template: "%s | Editorial Blog",
  },
  description:
    "Descobre artigos sobre tecnologia, cultura e inovação. Lê livremente e junta-te à discussão com a nossa comunidade de leitores.",
  openGraph: {
    title: "Editorial — Blog de Artigos, Ideias e Histórias",
    description:
      "Descobre artigos sobre tecnologia, cultura e inovação. Lê livremente e junta-te à discussão com a nossa comunidade de leitores.",
    type: "website",
    locale: "pt_PT",
    siteName: "Editorial Blog",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-[#FAF9F6] text-[#20211F] antialiased selection:bg-[#c2573a] selection:text-white dark:bg-[#141614] dark:text-[#F0F0EB]">
        <ThemeProvider>
          <AuthInitializer />
          <SiteChrome>
            <main className="flex-1">{children}</main>
          </SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}