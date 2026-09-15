import Link from "next/link";
import type { Post } from "@/types/post";

interface PostListItemProps {
	post: Post;
}

export default function PostListItem({
	post,
}: PostListItemProps) {
	return (
		<Link
			href={`/dashboard/posts/${post.id}`}
			className="block rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
						{post.title}
					</h3>

					<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
						{post.author.firstName} {post.author.lastName}
					</p>
				</div>

				<span
					className={
						post.published
							? "shrink-0 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400"
							: "shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
					}
				>
					{post.published ? "Publicado" : "Rascunho"}
				</span>
			</div>

			<div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
				<span>
					{post.likesCount}{" "}
					{post.likesCount === 1 ? "like" : "likes"}
				</span>

				<span>
					{post.commentsCount}{" "}
					{post.commentsCount === 1 ? "comentário" : "comentários"}
				</span>

				<span>
					{new Date(post.timestamp).toLocaleDateString("pt-PT")}
				</span>
			</div>
		</Link>
	);
}