"use client";

import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

export default function AuthInitializer() {
	const restoreAuth = useAuthStore((state) => state.restoreAuth);

	useEffect(() => {
		restoreAuth();
	}, [restoreAuth]);

	return null;
}