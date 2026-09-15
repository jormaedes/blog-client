"use client";

import { useState } from "react";
import {
  Check,
  Heart,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteComment,
  likeComment,
  unlikeComment,
  updateComment,
} from "@/lib/api";

import type { Comment } from "@/types/comment";

import ConfirmDialog from "@/components/ConfirmDialog";

interface CommentListProps {
  comments: Comment[];
  currentUserId: number | null;
  isPostAuthor: boolean;
  token: string;
  onCommentDeleted: () => void;
  onCommentUpdated: () => void;
}

export default function CommentList({
  comments,
  currentUserId,
  isPostAuthor,
  token,
  onCommentDeleted,
  onCommentUpdated,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(
    null
  );

  const [editingContent, setEditingContent] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(
    null
  );

  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(
    null
  );

  const [likingCommentId, setLikingCommentId] = useState<number | null>(
    null
  );

  const [savingCommentId, setSavingCommentId] = useState<number | null>(
    null
  );

  function startEditing(comment: Comment) {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  }

  function cancelEditing() {
    setEditingCommentId(null);
    setEditingContent("");
  }

  async function handleUpdate(commentId: number) {
    const content = editingContent.trim();

    if (!content) {
      return;
    }

    try {
      setSavingCommentId(commentId);

      await updateComment(commentId, content, token);

      cancelEditing();
      onCommentUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingCommentId(null);
    }
  }

  async function handleDelete() {
    if (!commentToDelete) {
      return;
    }

    try {
      setDeletingCommentId(commentToDelete.id);

      await deleteComment(commentToDelete.id, token);

      setCommentToDelete(null);
      onCommentDeleted();
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingCommentId(null);
    }
  }

  async function handleLike(comment: Comment) {
    try {
      setLikingCommentId(comment.id);

      if (comment.likedByMe) {
        await unlikeComment(comment.id, token);
      } else {
        await likeComment(comment.id, token);
      }

      onCommentUpdated();
    } catch (error) {
      console.error(error);
    } finally {
      setLikingCommentId(null);
    }
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ainda não existem comentários neste post.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {comments.map((comment) => {
          const isOwner = currentUserId === comment.userId;
          const canEdit = isOwner;
          const canDelete = isOwner || isPostAuthor;

          const isEditing = editingCommentId === comment.id;
          const isDeleting = deletingCommentId === comment.id;
          const isLiking = likingCommentId === comment.id;
          const isSaving = savingCommentId === comment.id;

          const initials = `${comment.user.firstName.charAt(
            0
          )}${comment.user.lastName.charAt(0)}`.toUpperCase();

          return (
            <article
              key={comment.id}
              className="border-b border-gray-100 pb-6 last:border-b-0 dark:border-gray-800"
            >
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {comment.user.firstName} {comment.user.lastName}
                    </p>

                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      @{comment.user.username}
                    </span>

                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      ·
                    </span>

                    <time
                      dateTime={comment.timestamp}
                      className="text-xs text-gray-400 dark:text-gray-500"
                    >
                      {new Date(comment.timestamp).toLocaleDateString(
                        "pt-PT",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <textarea
                        value={editingContent}
                        onChange={(event) =>
                          setEditingContent(event.target.value)
                        }
                        rows={3}
                        disabled={isSaving}
                        className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                      />

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(comment.id)}
                          disabled={isSaving || !editingContent.trim()}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving ? (
                            <Loader2
                              size={13}
                              className="animate-spin"
                            />
                          ) : (
                            <Check size={13} />
                          )}

                          Guardar
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isSaving}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gray-200 px-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
                        >
                          <X size={13} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleLike(comment)}
                        disabled={isLiking}
                        aria-label={
                          comment.likedByMe
                            ? "Remover gosto"
                            : "Gostar do comentário"
                        }
                        className={
                          comment.likedByMe
                            ? "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40"
                            : "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                        }
                      >
                        {isLiking ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                        ) : (
                          <Heart
                            size={14}
                            className={
                              comment.likedByMe
                                ? "fill-current"
                                : undefined
                            }
                          />
                        )}

                        {comment.likesCount}
                      </button>

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => startEditing(comment)}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <Pencil size={14} />
                          Editar
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setCommentToDelete(comment)}
                          disabled={isDeleting}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                        >
                          {isDeleting ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          Eliminar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <ConfirmDialog
        open={commentToDelete !== null}
        title="Eliminar comentário?"
        description="Tens a certeza de que queres eliminar este comentário? Esta ação não pode ser desfeita."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        isLoading={deletingCommentId !== null}
        onConfirm={handleDelete}
        onCancel={() => {
          if (deletingCommentId === null) {
            setCommentToDelete(null);
          }
        }}
      />
    </>
  );
}