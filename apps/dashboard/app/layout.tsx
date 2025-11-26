import type { Metadata } from "next";
import "./tailwind.css";
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
