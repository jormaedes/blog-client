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
      <div className="rounded-2xl border border-gray-200/90 bg-gradient-to-br from-indigo-50/50 via-white to-gray-50/50 p-6 text-center sm:p-8 dark:border-gray-800 dark:from-indigo-950/20 dark:via-gray-900/60 dark:to-gray-900/40">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
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
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700"
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
      className="rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900/70"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
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
          className="block w-full resize-y rounded-xl border border-gray-200/90 bg-gray-50/50 p-3.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400 dark:focus:bg-gray-900"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="mt-4 flex items-center justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
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