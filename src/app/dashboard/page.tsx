"use client";

import { useEffect, useState } from "react";

import { getPosts, getToken, getRecentComments } from "@/lib/api";
import useAuthStore from "@/stores/authStore";
import type { Post } from "@/types/post";
import type { RecentComment } from "@/types/comment";
import {
  FileText,
  MessageCircle,
  PenLine,
  Send,
} from "lucide-react";

import StatCard from "@/components/StatCard";
import PostListItem from "@/components/PostListItem";
import Link from "next/link";
import RecentCommentItem from "@/components/RecentCommentItem";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);

  async function loadDashboard() {
    try {
      const token = getToken();

      if (!token) return;

      const [postsData, commentsData] = await Promise.all([
        getPosts(token),
        getRecentComments(token),
      ]);

      setPosts(postsData);
      setRecentComments(commentsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const totalPosts = posts.length;

  const publishedPosts = posts.filter(
    (post) => post.published
  ).length;

  const draftPosts = posts.filter(
    (post) => !post.published
  ).length;

  const totalComments = posts.reduce(
    (total, post) => total + post.commentsCount,
    0
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Olá, {user?.firstName}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Aqui está um resumo do teu blog.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total de posts"
          value={totalPosts}
          icon={FileText}
        />

        <StatCard
          label="Publicados"
          value={publishedPosts}
          icon={Send}
        />

        <StatCard
          label="Rascunhos"
          value={draftPosts}
          icon={PenLine}
        />

        <StatCard
          label="Comentários"
          value={totalComments}
          icon={MessageCircle}
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Posts recentes
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Os últimos posts do teu blog.
              </p>
            </div>

            <Link
              href="/dashboard/posts"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Ver todos
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
            {posts.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ainda não existem posts.
                </p>
              </div>
            ) : (
              posts.slice(0, 5).map((post) => (
                <PostListItem key={post.id} post={post} />
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comentários recentes
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Últimas interações no teu blog.
              </p>
            </div>

            <Link
              href="/dashboard/posts"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Ver posts
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
            {recentComments.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ainda não existem comentários.
                </p>
              </div>
            ) : (
              recentComments.map((comment) => (
                <RecentCommentItem
                  key={comment.id}
                  comment={comment}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}