import type { Metadata } from "next";
import AuthInitializer from "@/components/AuthInitializer";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
      <body className="flex min-h-screen flex-col bg-[#F8F9FB] text-[#17191C] antialiased selection:bg-indigo-500 selection:text-white dark:bg-[#0F1115] dark:text-[#F1F3F5]">
        <ThemeProvider>
          <AuthInitializer />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}