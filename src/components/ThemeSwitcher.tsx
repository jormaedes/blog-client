"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themes = [
	{
		value: "light",
		label: "Light",
		icon: Sun,
	},
	{
		value: "system",
		label: "System",
		icon: Monitor,
	},
	{
		value: "dark",
		label: "Dark",
		icon: Moon,
	},
] as const;

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
			{themes.map(({ value, label, icon: Icon }) => {
				const isActive = theme === value;

				return (
					<button
						key={value}
						type="button"
						onClick={() => setTheme(value)}
						aria-label={`Tema ${label}`}
						aria-pressed={isActive}
						className={`
              flex h-8 w-8 items-center justify-center rounded-md
              transition-colors
              ${isActive
								? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
								: "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
							}
            `}
					>
						<Icon size={16} strokeWidth={2} />
					</button>
				);
			})}
		</div>
	);
}