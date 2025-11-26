import type { Metadata } from "next";
import "@repo/ui/src/globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

