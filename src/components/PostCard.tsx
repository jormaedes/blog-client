import Link from "next/link";

import type { Post } from "@/types/post";

interface PostCardProps {
	post: Post;
	isAuthor: boolean;
	isDeleting: boolean;
	isPublishing: boolean;
	onDelete: (postId: number) => void;
	onTogglePublished: (
		postId: number,
		published: boolean
	) => void;
}


export default function PostCard({
	post,
	isAuthor,
	isDeleting,
	isPublishing,
	onDelete,
	onTogglePublished,
}: PostCardProps) {
	function formatDate(timestamp: string) {
		return new Date(timestamp).toLocaleDateString("pt-PT");
	}

	function getCoverImage(content: string) {
		const match = content.match(
			/<img[^>]+src=["']([^"']+)["']/i
		);

		return match?.[1] ?? null;
	}

	const coverImage = getCoverImage(post.content);

	return (
		<article className="relative min-h-80 overflow-hidden rounded-xl bg-neutral-800">
			{coverImage && (
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage: `url(${coverImage})`,
					}}
				/>
			)}

			{coverImage && (
				<div className="absolute inset-0 bg-black/60" />
			)}

			<div className="relative z-10 flex min-h-80 flex-col justify-end p-6 text-white">
				<h2 className="text-2xl font-bold">
					<Link href={`/dashboard/posts/${post.id}`}>
						{post.title}
					</Link>
				</h2>

				<p className="mt-2 text-sm">
					Por {post.author.firstName} {post.author.lastName}{" "}
					(@{post.author.username})
				</p>

				<div className="mt-2 flex gap-3 text-sm">
					<span>{formatDate(post.timestamp)}</span>

					<span>
						{post.published ? "Publicado" : "Rascunho"}
					</span>
				</div>
				<Link
					href={`/dashboard/posts/${post.id}`}
					className="mt-4 inline-block z-50 text-white"
				>
					Ler post →
				</Link>

				{isAuthor && (
					<div className="mt-4 flex gap-3">
						<Link
							href={`/dashboard/posts/${post.id}/edit`}
						>
							Editar
						</Link>

						<button
							type="button"
							onClick={() =>
								onTogglePublished(post.id, post.published)
							}
							disabled={isPublishing}
						>
							{isPublishing
								? "A atualizar..."
								: post.published
									? "Despublicar"
									: "Publicar"}
						</button>

						<button
							type="button"
							onClick={() => onDelete(post.id)}
							disabled={isDeleting}
						>
							{isDeleting
								? "A apagar..."
								: "Apagar"}
						</button>
					</div>
				)}
			</div>
		</article>
	);
}