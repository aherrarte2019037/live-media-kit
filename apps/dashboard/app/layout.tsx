import type { Metadata } from "next";
import "./tailwind.css";
import { BaseLayout } from "@repo/ui";
import { authGuard } from "@/lib/utils/auth-guard";

export const metadata: Metadata = {
  title: {
    default: "Kyt | Dashboard",
    template: "Kyt | %s",
  },
  description: "Manage your verified media kit and partnerships.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authGuard();

  return <BaseLayout forcedTheme="light">{children}</BaseLayout>;
}
