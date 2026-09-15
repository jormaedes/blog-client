"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { likePost, unlikePost } from "@/lib/api";
import useAuthStore from "@/stores/authStore";
import AuthPromptModal from "@/components/AuthPromptModal";

interface PostLikeButtonProps {
  postId: number;
  likedByMe: boolean;
  likesCount: number;
  token: string | null;
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  async function handleLike() {
    if (!isAuthenticated || !token) {
      setShowAuthModal(true);
      return;
    }

    if (isLoading) return;

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
      console.error("Erro ao alterar gosto:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleLike}
        disabled={isLoading}
        aria-label={likedByMe ? "Remover gosto do artigo" : "Gostar deste artigo"}
        className={`inline-flex h-11 items-center gap-2.5 rounded-xl border px-4 text-sm font-semibold transition-all ${
          likedByMe
            ? "border-red-200 bg-red-50/80 text-red-600 shadow-sm shadow-red-500/10 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50"
            : "border-gray-200/90 bg-white text-gray-700 shadow-sm hover:border-red-200 hover:bg-red-50/50 hover:text-red-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        }`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart
            size={18}
            className={`transition-transform duration-200 active:scale-125 ${
              likedByMe ? "fill-current" : ""
            }`}
          />
        )}
        <span>
          {likesCount} {likesCount === 1 ? "Gosto" : "Gostos"}
        </span>
      </button>

      <AuthPromptModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Gostaste deste artigo?"
        description="Inicia sessão ou cria uma conta para deixar o teu gosto e apoiar o autor."
        redirectTo={`/posts/${postId}`}
      />
    </>
  );
}