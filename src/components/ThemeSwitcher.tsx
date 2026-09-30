"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const isDark = theme === "dark";
	const Icon = isDark ? Sun : Moon;

	return (
		<button
			type="button"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
			title={isDark ? "Tema claro" : "Tema escuro"}
			className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
		>
			<Icon size={18} strokeWidth={1.8} />
		</button>
	);
}