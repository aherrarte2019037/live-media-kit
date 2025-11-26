import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@repo/ui";

export const metadata: Metadata = {
  title: "MyBio Space",
  description: "Live Media Kit Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
