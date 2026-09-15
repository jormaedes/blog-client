"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PenLine } from "lucide-react";

import { deletePost, getPosts, getToken, togglePostPublished } from "@/lib/api";
import type { Post } from "@/types/post";
import PostManagementItem from "@/components/PostManagementItem";
import ConfirmDialog from "@/components/ConfirmDialog";

type Filter = "all" | "published" | "drafts";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingPostId, setUpdatingPostId] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const token = getToken();

        if (!token) return;

        const data = await getPosts(token);
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (filter === "published") return post.published;
    if (filter === "drafts") return !post.published;

    return true;
  });


  async function confirmDelete() {
    if (!postToDelete) return;

    try {
      const token = getToken();

      if (!token) return;

      setIsDeleting(true);

      await deletePost(postToDelete.id.toString(), token);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post.id !== postToDelete.id)
      );

      setPostToDelete(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDelete(post: Post) {
    setPostToDelete(post);
  }

  async function handleTogglePublished(post: Post) {
    try {
      const token = getToken();

      if (!token) return;

      setUpdatingPostId(post.id);

      await togglePostPublished(
        post.id.toString(),
        !post.published,
        token
      );

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id
            ? {
              ...currentPost,
              published: !currentPost.published,
            }
            : currentPost
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingPostId(null);
    }
  }



  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A carregar posts...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Posts
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gere os posts do teu blog.
          </p>
        </div>

        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <PenLine size={16} />
          Escrever post
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-8 flex items-center gap-1 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${filter === "all"
            ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
        >
          Todos
        </button>

        <button
          type="button"
          onClick={() => setFilter("published")}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${filter === "published"
            ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
        >
          Publicados
        </button>

        <button
          type="button"
          onClick={() => setFilter("drafts")}
          className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${filter === "drafts"
            ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            }`}
        >
          Rascunhos
        </button>
      </div>

      {/* List */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredPosts.length}{" "}
          {filteredPosts.length === 1 ? "post" : "posts"}
        </p>
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="hidden items-center gap-4 border-b border-gray-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:border-gray-800 md:flex">
          <div className="min-w-0 flex-1">
            Post
          </div>

          <div className="w-28">
            Estado
          </div>

          <div className="w-20">
            Likes
          </div>

          <div className="w-24">
            Comentários
          </div>

          <div className="w-24">
            Data
          </div>

          <div className="w-28">
            Ações
          </div>
        </div>
        {filteredPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhum post encontrado.
            </p>
          </div>
        ) : (

          filteredPosts.map((post) => (
            <PostManagementItem
              onTogglePublished={handleTogglePublished}
              key={post.id}
              post={post}
              isUpdating={updatingPostId === post.id}
              onDelete={handleDelete}
            />
          ))
        )}

        <ConfirmDialog
          open={postToDelete !== null}
          title="Eliminar post?"
          description={
            postToDelete
              ? `Tem certeza de que deseja eliminar "${postToDelete.title}"? Esta ação não pode ser desfeita.`
              : ""
          }
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!isDeleting) {
              setPostToDelete(null);
            }
          }}
        />
      </div>
    </div>
  );
}