"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { getComments, getCurrentUser, getPost, getToken } from "@/lib/api";
import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";
import PostContent from "@/components/PostContent";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import PostLikeButton from "@/components/PostLikeButton";
import {
  extractFirstImage,
  formatDate,
  getReadingTime,
} from "@/lib/postUtils";

interface PostPageProps {
  params: Promise<{ postId: string }>;
}

export default function PostPage({ params }: PostPageProps) {
  const resolvedParams = use(params);
  const postId = resolvedParams.postId;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        const currentToken = getToken();
        setToken(currentToken);

        const [postData, commentsData] = await Promise.all([
          getPost(postId, currentToken),
          getComments(postId, currentToken),
        ]);

        setPost(postData);
        setComments(commentsData);

        if (currentToken) {
          try {
            const userData = await getCurrentUser(currentToken);
            setCurrentUserId(userData.id);
          } catch {
            // Token might be expired or invalid
          }
        }
      } catch (err) {
        console.error("Erro ao carregar artigo:", err);
        if (err instanceof Error && err.message.includes("não encontrado")) {
          setError("Artigo não encontrado.");
        } else {
          setError("Não foi possível carregar o artigo. Por favor tenta novamente.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [postId]);

  async function reloadComments() {
    try {
      const currentToken = getToken();
      const commentsData = await getComments(postId, currentToken);
      setComments(commentsData);
    } catch (err) {
      console.error("Erro ao recarregar comentários:", err);
    }
  }

  function handlePostLikeChanged(likedByMe: boolean, likesCount: number) {
    setPost((curr) =>
      curr ? { ...curr, likedByMe, likesCount } : curr
    );
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-32 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-10 w-3/4 rounded-xl bg-gray-200 dark:bg-gray-800 sm:h-14" />
          <div className="flex items-center gap-3 pt-2">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-1.5">
              <div className="h-4 w-36 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div className="h-72 w-full rounded-2xl bg-gray-200 dark:bg-gray-800 sm:h-96" />
          <div className="space-y-3 pt-6">
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found state
  if (error || !post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 p-12 dark:border-gray-800 dark:bg-gray-900/30">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {error || "Artigo não encontrado"}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            O artigo que procuras não existe, foi removido ou não está publicado.
          </p>
          <div className="mt-6">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <ArrowLeft size={16} />
              <span>Ver todos os artigos</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coverImage = extractFirstImage(post.content);
  const readingTime = getReadingTime(post.content);
  const fullDate = formatDate(post.timestamp, true);

  const authorInitials = `${post.author?.firstName?.charAt(0) || ""}${
    post.author?.lastName?.charAt(0) || ""
  }`.toUpperCase() || "A";

  const authorFullName =
    `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
    post.author?.username ||
    "Autor";

  const isPostAuthor = currentUserId === post.authorId;

  return (
    <div className="min-h-screen pb-16 pt-6 sm:pb-24 sm:pt-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            <span>Voltar aos artigos</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-950/60">
              <Clock size={12} />
              {readingTime}
            </span>
            <span className="text-gray-400 dark:text-gray-600">•</span>
            <time dateTime={post.timestamp} className="text-gray-500 dark:text-gray-400">
              {fullDate}
            </time>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white leading-[1.15]">
            {post.title}
          </h1>

          {/* Author metadata bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200/80 pb-8 dark:border-gray-800">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/20">
                {authorInitials}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {authorFullName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  @{post.author?.username}
                </p>
              </div>
            </div>

            {/* Share action */}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Partilhar artigo"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600 dark:text-green-400" />
                  <span className="text-green-600 dark:text-green-400">Link copiado!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span>Partilhar</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Featured Banner Image (extracted from HTML content) */}
        {coverImage && (
          <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200/60 shadow-lg dark:border-gray-800/80">
            <div
              className="relative aspect-[16/9] w-full bg-cover bg-center sm:aspect-[21/9]"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          </div>
        )}

        {/* Article HTML Content */}
        <main className="mb-12">
          <PostContent content={post.content} />
        </main>

        {/* Interaction Bar (Likes & Comments Count) */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm sm:p-6 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="flex items-center gap-3">
            <PostLikeButton
              postId={post.id}
              likedByMe={post.likedByMe}
              likesCount={post.likesCount}
              token={token}
              onLikeChanged={handlePostLikeChanged}
            />

            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <MessageCircle size={18} />
              <span>
                {comments.length}{" "}
                {comments.length === 1 ? "Comentário" : "Comentários"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
          >
            {copied ? "Link copiado!" : "Partilhar este artigo"}
          </button>
        </div>

        {/* Author Bio Card */}
        <div className="mt-8 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900/30">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-base font-bold text-white shadow-sm">
              {authorInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Sobre o Autor
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold text-gray-900 dark:text-white">
                {authorFullName}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Autor e colaborador no Editorial Blog. Apaixonado por partilhar conhecimento e debater ideias com a comunidade.
              </p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-12 sm:mt-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Comentários ({comments.length})
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Junta-te à conversa e partilha a tua visão sobre este artigo.
            </p>
          </div>

          {/* Comment form / Auth prompt */}
          <div className="mb-10">
            <CommentForm
              postId={post.id.toString()}
              token={token}
              onCommentCreated={reloadComments}
            />
          </div>

          {/* Comments List */}
          <CommentList
            comments={comments}
            currentUserId={currentUserId}
            isPostAuthor={isPostAuthor}
            token={token}
            postId={post.id}
            onCommentDeleted={reloadComments}
            onCommentUpdated={reloadComments}
          />
        </section>
      </div>
    </div>
  );
}
