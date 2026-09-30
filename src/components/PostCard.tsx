import Link from "next/link";
import { Heart, MessageCircle, Clock, ArrowUpRight } from "lucide-react";
import type { Post } from "@/types/post";
import {
  extractFirstImage,
  extractExcerpt,
  formatDate,
  getReadingTime,
} from "@/lib/postUtils";

interface PostCardProps {
  post: Post;
  priority?: boolean;
}

export default function PostCard({ post }: PostCardProps) {
  const coverImage = extractFirstImage(post.content);
  const excerpt = extractExcerpt(post.content, coverImage ? 130 : 160);
  const dateFormatted = formatDate(post.timestamp);
  const readingTime = getReadingTime(post.content);

  const authorInitials = `${post.author?.firstName?.charAt(0) || ""}${
    post.author?.lastName?.charAt(0) || ""
  }`.toUpperCase() || "A";

  const authorFullName =
    `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() ||
    post.author?.username ||
    "Autor";

  return (
    <article className="group min-w-0">
      <Link href={`/posts/${post.id}`} className="block focus-visible:outline-[#c2573a]">
        <div className="aspect-[16/10] overflow-hidden rounded-md bg-[#e8e7e1] dark:bg-[#252925]">
          {coverImage ? (
            <div
              className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          ) : (
            <div className="flex h-full items-end justify-between p-5 text-[#55574f] dark:text-[#c8c8bf]">
              <span className="font-serif text-2xl">Editorial</span>
              <ArrowUpRight size={20} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} />
              {readingTime}
            </span>
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Heart size={13} className={post.likesCount > 0 ? "fill-[#c2573a] text-[#c2573a]" : ""} />
                {post.likesCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <MessageCircle size={13} />
                {post.commentsCount}
              </span>
            </span>
          </div>

          <h2 className="mt-2 font-serif text-xl leading-snug text-gray-950 transition-colors group-hover:text-[#a5452e] dark:text-white dark:group-hover:text-[#df8064]">
            {post.title}
          </h2>
          {excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
              {excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-200/80 pt-3 text-xs dark:border-gray-800">
            <span className="truncate font-medium text-gray-800 dark:text-gray-200">
              {authorFullName}
            </span>
            <time dateTime={post.timestamp} className="ml-3 shrink-0 text-gray-500 dark:text-gray-400">
              {dateFormatted}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}