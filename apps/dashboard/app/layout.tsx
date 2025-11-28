import type { Metadata } from "next";
import "./tailwind.css";
import { ThemeProvider } from "@repo/ui";

export const metadata: Metadata = {
  title: {
    default: "Kyt | Dashboard",
    template: "Kyt | %s",
  },
  description: "Manage your verified media kit and partnerships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
