"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react";

import {
  deletePost,
  getComments,
  getCurrentUser,
  getPost,
  getToken,
  togglePostPublished,
} from "@/lib/api";

import type { Post } from "@/types/post";
import type { Comment } from "@/types/comment";

import PostContent from "@/components/PostContent";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import PostLikeButton from "@/components/PostLikeButton";

export default function PostPage() {
  const params = useParams();
  const router = useRouter();

  const postId = params.postId as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    async function loadPostData() {
      try {
        const token = getToken();

        if (!token) {
          router.push("/login");
          return;
        }

        const [postData, commentsData, userData] = await Promise.all([
          getPost(postId, token),
          getComments(postId, token),
          getCurrentUser(token),
        ]);

        setPost(postData);
        setComments(commentsData);
        setCurrentUserId(userData.id);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPostData();
  }, [postId, router]);

  async function handleTogglePublished() {
    if (!post) return;

    try {
      const token = getToken();

      if (!token) return;

      setIsUpdating(true);

      await togglePostPublished(
        post.id.toString(),
        !post.published,
        token
      );

      setPost((currentPost) =>
        currentPost
          ? {
              ...currentPost,
              published: !currentPost.published,
            }
          : currentPost
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!post) return;

    try {
      const token = getToken();

      if (!token) return;

      setIsDeleting(true);

      await deletePost(post.id.toString(), token);

      router.push("/dashboard/posts");
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  }

  async function reloadComments() {
    try {
      const token = getToken();

      if (!token) return;

      const commentsData = await getComments(postId, token);

      setComments(commentsData);
    } catch (error) {
      console.error(error);
    }
  }

  function handlePostLikeChanged(
    likedByMe: boolean,
    likesCount: number
  ) {
    setPost((currentPost) =>
      currentPost
        ? {
            ...currentPost,
            likedByMe,
            likesCount,
          }
        : currentPost
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" />

            <div className="space-y-3">
              <div className="h-10 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="space-y-4 pt-6">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/dashboard/posts"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            Voltar aos posts
          </Link>

          <div className="mt-12 text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Post não encontrado
            </h1>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              O post que procuras não existe ou foi removido.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const token = getToken();
  const isPostAuthor = currentUserId === post.authorId;

  const authorInitials = `${post.author.firstName.charAt(
    0
  )}${post.author.lastName.charAt(0)}`.toUpperCase();

  return (
    <>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard/posts"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar aos posts
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/dashboard/posts/${post.id}/edit`}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Edit size={15} />
                Editar
              </Link>

              <button
                type="button"
                onClick={handleTogglePublished}
                disabled={isUpdating}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {isUpdating && (
                  <Loader2 size={15} className="animate-spin" />
                )}

                {post.published ? "Despublicar" : "Publicar"}
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                aria-label="Eliminar post"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-900 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <header className="mt-8 border-b border-gray-200 pb-8 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={
                  post.published
                    ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                }
              >
                {post.published ? "Publicado" : "Rascunho"}
              </span>

              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.timestamp).toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {authorInitials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {post.author.firstName} {post.author.lastName}
                </p>

                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  @{post.author.username}
                </p>
              </div>
            </div>
          </header>

          <main className="mt-8">
            <PostContent content={post.content} />
          </main>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-gray-200 py-5 dark:border-gray-800">
            {token && (
              <PostLikeButton
                postId={post.id}
                likedByMe={post.likedByMe}
                likesCount={post.likesCount}
                token={token}
                onLikeChanged={handlePostLikeChanged}
              />
            )}

            {!token && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {post.likesCount}{" "}
                {post.likesCount === 1 ? "gosto" : "gostos"}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageCircle size={17} />

              <span>
                {comments.length}{" "}
                {comments.length === 1
                  ? "comentário"
                  : "comentários"}
              </span>
            </div>
          </div>

          <section className="mt-10 pb-10">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Comentários
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Veja o que os leitores estão a dizer sobre este post.
              </p>
            </div>

            {token && (
              <div className="mb-8">
                <CommentForm
                  postId={post.id.toString()}
                  token={token}
                  onCommentCreated={reloadComments}
                />
              </div>
            )}

            <CommentList
              comments={comments}
              currentUserId={currentUserId}
              isPostAuthor={isPostAuthor}
              token={token ?? ""}
              onCommentDeleted={reloadComments}
              onCommentUpdated={reloadComments}
            />
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Eliminar post?"
        description={`Tens a certeza de que queres eliminar "${post.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteDialog(false);
          }
        }}
      />
    </>
  );
}