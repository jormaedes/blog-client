"use client";

import { useState, type FormEvent } from "react";
import { createComment } from "@/lib/api";
import type { Comment } from "@/types/comment";
import { Loader2, Send } from "lucide-react";

interface CommentFormProps {
  postId: string;
  token: string;
  onCommentCreated: (comment: Comment) => void;
}

export default function CommentForm({ postId, token, onCommentCreated, }: CommentFormProps) {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!content.trim()) {
			return;
		}

		try {
			setIsSubmitting(true);
			setError("");

			const comment = await createComment(
				postId,
				content.trim(),
				token
			);

			setContent("");
			onCommentCreated(comment);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	 return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="comment-content"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Adicionar comentário
        </label>

        <textarea
          id="comment-content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escreve o teu comentário..."
          rows={4}
          disabled={isSubmitting}
          className="block w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}

          {isSubmitting ? "A publicar..." : "Comentar"}
        </button>
      </div>
    </form>
  );
}