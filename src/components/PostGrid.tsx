import type { Post } from "@/types/post";
import PostCard from "@/components/PostCard";
import { BookOpen } from "lucide-react";

interface PostGridProps {
  posts: Post[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
}

export default function PostGrid({
  posts,
  isLoading = false,
  emptyTitle = "Nenhum artigo encontrado",
  emptyMessage = "Não encontramos nenhum artigo correspondente à tua pesquisa.",
}: PostGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex min-h-[380px] sm:min-h-[410px] flex-col justify-between rounded-2xl border border-gray-200/60 bg-gray-100 p-6 animate-pulse dark:border-gray-800 dark:bg-gray-900/60"
          >
            <div className="flex justify-between">
              <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="space-y-3 pt-12">
              <div className="h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-5/6 rounded-md bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/40 dark:border-gray-800/40">
                <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <BookOpen size={24} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
          {emptyTitle}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} priority={index < 3} />
      ))}
    </div>
  );
}
