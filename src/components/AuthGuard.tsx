"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import useAuthStore from "@/stores/authStore";

interface AuthorGuardProps {
	children: ReactNode;
}

export default function AuthorGuard({
	children,
}: AuthorGuardProps) {
	const router = useRouter();

	const user = useAuthStore((state) => state.user);
	const isAuthLoading = useAuthStore(
		(state) => state.isAuthLoading
	);

	useEffect(() => {
		if (isAuthLoading) return;

		if (!user) {
			router.replace("/login");
			return;
		}

		if (user.userType !== "AUTHOR") {
			router.replace("/dashboard");
		}
	}, [isAuthLoading, user, router]);

	if (isAuthLoading || !user) {
		return null;
	}

	if (user.userType !== "AUTHOR") {
		return null;
	}

	return children;
}