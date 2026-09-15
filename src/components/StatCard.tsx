import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	value: number;
	icon: LucideIcon;
}

export default function StatCard({
	label,
	value,
	icon: Icon,
}: StatCardProps) {
	return (
		<div className="min-h-32 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
			<div className="flex h-full items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
						{label}
					</p>

					<p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
						{value}
					</p>
				</div>

				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
					<Icon
						size={19}
						className="text-gray-500 dark:text-gray-400"
					/>
				</div>
			</div>
		</div>
	);
}