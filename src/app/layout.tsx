import type { Metadata } from "next";
import AuthInitializer from "@/components/AuthInitializer";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Admin",
  description: "Blog administration dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F8F9FB] text-[#17191C] antialiased dark:bg-[#0F1115] dark:text-[#F1F3F5]">
        <ThemeProvider>
          <AuthInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}