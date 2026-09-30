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
      <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="animate-pulse"
          >
            <div className="aspect-[16/10] rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-3 pt-4">
              <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="border-y border-gray-200 py-16 text-center dark:border-gray-800">
        <div className="text-gray-500 dark:text-gray-400">
          <BookOpen size={22} className="mx-auto" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 font-serif text-xl text-gray-900 dark:text-white">
          {emptyTitle}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} priority={index < 3} />
      ))}
    </div>
  );
}
