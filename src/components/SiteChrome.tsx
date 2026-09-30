"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface SiteChromeProps {
	children: ReactNode;
}

export default function SiteChrome({ children }: SiteChromeProps) {
	const pathname = usePathname();

	if (pathname === "/login" || pathname === "/signup") return children;

	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}