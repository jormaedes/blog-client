import Link from "next/link";
import { Heart, MessageCircle, Clock, Sparkles } from "lucide-react";
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
    <article className="group relative flex h-full flex-col">
      <Link
        href={`/posts/${post.id}`}
        className={`relative flex min-h-[380px] w-full flex-1 flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[410px] ${
          coverImage
            ? "border border-gray-200/40 p-6 sm:p-7 dark:border-gray-800/80"
            : "border border-gray-200/90 bg-gradient-to-br from-white via-slate-50/50 to-gray-100/60 p-6 shadow-sm sm:p-7 dark:border-gray-800/90 dark:from-[#13161D] dark:via-[#101217] dark:to-[#0D0F13]"
        }`}
      >
        {/* If Cover Image is present -> Background Layer + Gradient Overlay */}
        {coverImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url(${coverImage})`,
              }}
            />
            {/* Multi-step dark gradient overlay for optimal text contrast with any image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 transition-opacity duration-300 group-hover:opacity-95" />
          </>
        ) : (
          /* Typographic / Minimalist Background Fallback */
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/10" />
            <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl dark:bg-violet-500/10" />
            <div className="absolute right-6 top-6 text-gray-200/40 dark:text-gray-800/40">
              <Sparkles size={36} strokeWidth={1} />
            </div>
          </div>
        )}

        {/* Top Header Information inside card */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium tracking-wide ${
              coverImage
                ? "border border-white/15 bg-black/40 text-white/90 backdrop-blur-md"
                : "border border-gray-200/80 bg-white/80 text-gray-700 backdrop-blur-sm dark:border-gray-750 dark:bg-gray-800/80 dark:text-gray-300"
            }`}
          >
            <Clock size={12} />
            <span>{readingTime}</span>
          </span>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                coverImage
                  ? "border border-white/15 bg-black/40 text-white/90 backdrop-blur-md"
                  : "border border-gray-200/80 bg-white/80 text-gray-600 backdrop-blur-sm dark:border-gray-750 dark:bg-gray-800/80 dark:text-gray-300"
              }`}
            >
              <Heart size={12} className={post.likesCount > 0 ? "fill-red-500 text-red-500" : ""} />
              <span>{post.likesCount}</span>
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                coverImage
                  ? "border border-white/15 bg-black/40 text-white/90 backdrop-blur-md"
                  : "border border-gray-200/80 bg-white/80 text-gray-600 backdrop-blur-sm dark:border-gray-750 dark:bg-gray-800/80 dark:text-gray-300"
              }`}
            >
              <MessageCircle size={12} />
              <span>{post.commentsCount}</span>
            </span>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-10 mt-auto pt-8">
          <h2
            className={`font-bold tracking-tight transition-colors line-clamp-2 ${
              coverImage
                ? "text-xl text-white group-hover:text-indigo-200 sm:text-2xl"
                : "text-xl text-gray-900 group-hover:text-indigo-600 sm:text-2xl dark:text-white dark:group-hover:text-indigo-400"
            }`}
          >
            {post.title}
          </h2>

          {excerpt && (
            <p
              className={`mt-2.5 text-sm leading-relaxed line-clamp-2 ${
                coverImage
                  ? "text-gray-200/90"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {excerpt}
            </p>
          )}

          {/* Author and Date Meta Bar */}
          <div
            className={`mt-5 flex items-center justify-between border-t pt-4 ${
              coverImage
                ? "border-white/15 text-gray-300"
                : "border-gray-100 text-gray-500 dark:border-gray-800 dark:text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  coverImage
                    ? "bg-white/20 text-white backdrop-blur-sm"
                    : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300"
                }`}
              >
                {authorInitials}
              </div>
              <div className="flex flex-col truncate">
                <span
                  className={`truncate text-xs font-semibold ${
                    coverImage ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {authorFullName}
                </span>
                <span className="truncate text-[11px] opacity-75">
                  @{post.author?.username}
                </span>
              </div>
            </div>

            <time
              dateTime={post.timestamp}
              className="shrink-0 text-xs font-medium"
            >
              {dateFormatted}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}