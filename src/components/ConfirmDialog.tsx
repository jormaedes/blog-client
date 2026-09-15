"use client";

import { Loader2, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
	open: boolean;
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isLoading?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmDialog({
	open,
	title,
	description,
	confirmLabel = "Eliminar",
	cancelLabel = "Cancelar",
	isLoading = false,
	onConfirm,
	onCancel,
}: ConfirmDialogProps) {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget && !isLoading) {
					onCancel();
				}
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-dialog-title"
				aria-describedby="confirm-dialog-description"
				className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
			>
				<div className="flex items-start justify-between gap-4 p-6">
					<div className="flex min-w-0 gap-4">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/40">
							<Trash2
								size={20}
								className="text-red-600 dark:text-red-400"
							/>
						</div>

						<div>
							<h2
								id="confirm-dialog-title"
								className="text-base font-semibold text-gray-900 dark:text-white"
							>
								{title}
							</h2>

							<p
								id="confirm-dialog-description"
								className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400"
							>
								{description}
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						aria-label="Fechar"
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
					>
						<X size={18} />
					</button>
				</div>

				<div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4 dark:border-gray-800">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
					>
						{cancelLabel}
					</button>

					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isLoading && <Loader2 size={16} className="animate-spin" />}
						{isLoading ? "A eliminar..." : confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}