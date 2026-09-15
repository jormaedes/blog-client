"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

import {
	likePost,
	unlikePost,
} from "@/lib/api";

interface PostLikeButtonProps {
	postId: number;
	likedByMe: boolean;
	likesCount: number;
	token: string;
	onLikeChanged: (likedByMe: boolean, likesCount: number) => void;
}

export default function PostLikeButton({
	postId,
	likedByMe,
	likesCount,
	token,
	onLikeChanged,
}: PostLikeButtonProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleLike() {
		if (isLoading) {
			return;
		}

		try {
			setIsLoading(true);

			if (likedByMe) {
				await unlikePost(postId.toString(), token);

				onLikeChanged(false, Math.max(0, likesCount - 1));
			} else {
				await likePost(postId.toString(), token);

				onLikeChanged(true, likesCount + 1);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleLike}
			disabled={isLoading}
			aria-label={likedByMe ? "Remover gosto" : "Gostar do post"}
			className={
				likedByMe
					? "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
					: "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
			}
		>
			{isLoading ? (
				<Loader2 size={17} className="animate-spin" />
			) : (
				<Heart
					size={17}
					className={likedByMe ? "fill-current" : undefined}
				/>
			)}

			<span>
				{likesCount} {likesCount === 1 ? "gosto" : "gostos"}
			</span>
		</button>
	);
}