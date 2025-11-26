import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@repo/ui";

export const metadata: Metadata = {
  title: "Dashboard - MyBio Space",
  description: "Creator Admin Portal",
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
