"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, Send, MessageSquare, LogIn, UserPlus } from "lucide-react";
import { createComment } from "@/lib/api";
import type { Comment } from "@/types/comment";
import useAuthStore from "@/stores/authStore";

interface CommentFormProps {
  postId: string;
  token: string | null;
  onCommentCreated: (comment: Comment) => void;
}

export default function CommentForm({
  postId,
  token,
  onCommentCreated,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim() || !token) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const comment = await createComment(postId, content.trim(), token);

      setContent("");
      onCommentCreated(comment);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível publicar o comentário.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // If user is not authenticated, show friendly invitation
  if (!isAuthenticated || !token) {
    return (
      <div className="border-y border-gray-200 bg-[#f5f4ef] p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-[#191c19]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8eee9] text-[#a5452e] dark:bg-[#38251f] dark:text-[#df8064]">
          <MessageSquare size={22} />
        </div>
        <h3 className="mt-3.5 text-base font-bold text-gray-900 dark:text-white">
          Participa na discussão
        </h3>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-gray-600 dark:text-gray-400">
          Inicia sessão ou cria uma conta de leitor para partilhar a tua opinião sobre este artigo.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/login?redirect=/posts/${postId}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#c2573a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a5452e]"
          >
            <LogIn size={15} />
            <span>Entrar</span>
          </Link>
          <Link
            href={`/signup?redirect=/posts/${postId}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          >
            <UserPlus size={15} />
            <span>Criar conta</span>
          </Link>
        </div>
      </div>
    );
  }

  const userInitials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U";

  return (
    <form
      onSubmit={handleSubmit}
      className="border-y border-gray-200 bg-white py-5 sm:py-6 dark:border-gray-800 dark:bg-transparent"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c2573a] text-xs font-semibold text-white">
          {userInitials}
        </div>
        <div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.firstName} {user?.lastName}
          </span>
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            (@{user?.username})
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="comment-content" className="sr-only">
          O teu comentário
        </label>
        <textarea
          id="comment-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreve o teu comentário..."
          rows={3}
          disabled={isSubmitting}
          className="block w-full resize-y rounded-md border border-gray-300/80 bg-[#faf9f6] p-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#c2573a] focus:bg-white focus:ring-2 focus:ring-[#c2573a]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-[#1b1e1b] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#df8064]"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#c2573a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#a5452e] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={15} />
          )}
          <span>{isSubmitting ? "A publicar..." : "Publicar comentário"}</span>
        </button>
      </div>
    </form>
  );
}