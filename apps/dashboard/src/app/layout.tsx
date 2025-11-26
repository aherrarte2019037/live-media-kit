import type { Metadata } from "next";
import "@repo/ui/src/globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

