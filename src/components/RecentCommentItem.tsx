import Link from "next/link";
import type { RecentComment } from "@/types/comment";

interface RecentCommentItemProps {
  comment: RecentComment;
}

export default function RecentCommentItem({
  comment,
}: RecentCommentItemProps) {
  return (
    <Link
      href={`/dashboard/posts/${comment.post.id}`}
      className="block rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {comment.user.firstName[0]}
          {comment.user.lastName[0]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {comment.user.username}
            </p>

            <span className="shrink-0 text-xs text-gray-400">
              {new Date(comment.timestamp).toLocaleDateString("pt-PT")}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {comment.content}
          </p>

          <div className="mt-2 flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span className="truncate">
              Em: {comment.post.title}
            </span>

            <span className="shrink-0">
              {comment.likesCount}{" "}
              {comment.likesCount === 1 ? "like" : "likes"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}