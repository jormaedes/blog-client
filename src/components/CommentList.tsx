"use client";

import { useState } from "react";
import {
  Check,
  Heart,
  Loader2,
  Pencil,
  Trash2,
  X,
  MessageCircle,
} from "lucide-react";
import {
  deleteComment,
  likeComment,
  unlikeComment,
  updateComment,
} from "@/lib/api";
import type { Comment } from "@/types/comment";
import ConfirmDialog from "@/components/ConfirmDialog";
import AuthPromptModal from "@/components/AuthPromptModal";
import { formatDate } from "@/lib/postUtils";

interface CommentListProps {
  comments: Comment[];
  currentUserId: number | null;
  isPostAuthor: boolean;
  token: string | null;
  postId?: string | number;
  onCommentDeleted: () => void;
  onCommentUpdated: () => void;
}

export default function CommentList({
  comments,
  currentUserId,
  isPostAuthor,
  token,
  postId,
  onCommentDeleted,
  onCommentUpdated,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<Comment | null>(null);
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null);
  const [savingCommentId, setSavingCommentId] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
    if (!content || !token) return;

    try {
      setSavingCommentId(commentId);
      await updateComment(commentId, content, token);
      cancelEditing();
      onCommentUpdated();
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
    } finally {
      setSavingCommentId(null);
    }
  }

  async function handleDelete() {
    if (!commentToDelete || !token) return;

    try {
      setDeletingCommentId(commentToDelete.id);
      await deleteComment(commentToDelete.id, token);
      setCommentToDelete(null);
      onCommentDeleted();
    } catch (error) {
      console.error("Erro ao eliminar comentário:", error);
    } finally {
      setDeletingCommentId(null);
    }
  }

  async function handleLike(comment: Comment) {
    if (!token || !currentUserId) {
      setShowAuthModal(true);
      return;
    }

    try {
      setLikingCommentId(comment.id);
      if (comment.likedByMe) {
        await unlikeComment(comment.id, token);
      } else {
        await likeComment(comment.id, token);
      }
      onCommentUpdated();
    } catch (error) {
      console.error("Erro ao alterar gosto no comentário:", error);
    } finally {
      setLikingCommentId(null);
    }
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/40 p-8 text-center sm:p-12 dark:border-gray-800 dark:bg-gray-900/20">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <MessageCircle size={22} />
        </div>
        <h3 className="mt-3.5 text-sm font-semibold text-gray-900 dark:text-white">
          Ainda não existem comentários
        </h3>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Sê o primeiro a partilhar a tua opinião sobre este artigo!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => {
          const isOwner = currentUserId === comment.userId;
          const canEdit = isOwner;
          const canDelete = isOwner || isPostAuthor;

          const isEditing = editingCommentId === comment.id;
          const isDeleting = deletingCommentId === comment.id;
          const isLiking = likingCommentId === comment.id;
          const isSaving = savingCommentId === comment.id;

          const initials = `${comment.user?.firstName?.charAt(0) || ""}${
            comment.user?.lastName?.charAt(0) || ""
          }`.toUpperCase() || comment.user?.username?.charAt(0)?.toUpperCase() || "U";

          const userFullName =
            `${comment.user?.firstName || ""} ${comment.user?.lastName || ""}`.trim() ||
            comment.user?.username ||
            "Utilizador";

          return (
            <article
              key={comment.id}
              className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-colors sm:p-6 dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {userFullName}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        @{comment.user?.username}
                      </span>
                      <span className="text-xs text-gray-300 dark:text-gray-600">
                        •
                      </span>
                      <time
                        dateTime={comment.timestamp}
                        className="text-xs text-gray-500 dark:text-gray-400"
                      >
                        {formatDate(comment.timestamp)}
                      </time>
                    </div>

                    {/* Author badge if comment author is post author */}
                    {isPostAuthor && isOwner && (
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        Autor
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-3">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows={3}
                        disabled={isSaving}
                        className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white dark:placeholder:text-gray-500"
                      />

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(comment.id)}
                          disabled={isSaving || !editingContent.trim()}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSaving ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <Check size={13} />
                          )}
                          <span>Guardar</span>
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          disabled={isSaving}
                          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <X size={13} />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Render strictly as safe plain text with whitespace preservation */
                    <p className="mt-2.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleLike(comment)}
                        disabled={isLiking}
                        aria-label={
                          comment.likedByMe
                            ? "Remover gosto do comentário"
                            : "Gostar do comentário"
                        }
                        className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-all ${
                          comment.likedByMe
                            ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            : "text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-400"
                        }`}
                      >
                        {isLiking ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Heart
                            size={13}
                            className={comment.likedByMe ? "fill-current" : ""}
                          />
                        )}
                        <span>{comment.likesCount}</span>
                      </button>

                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => startEditing(comment)}
                          className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <Pencil size={12} />
                          <span>Editar</span>
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => setCommentToDelete(comment)}
                          disabled={isDeleting}
                          className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                        >
                          {isDeleting ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          <span>Eliminar</span>
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
        confirmLabel="Eliminar comentário"
        cancelLabel="Cancelar"
        isLoading={deletingCommentId !== null}
        onConfirm={handleDelete}
        onCancel={() => {
          if (deletingCommentId === null) {
            setCommentToDelete(null);
          }
        }}
      />

      <AuthPromptModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Gostaste deste comentário?"
        description="Inicia sessão ou cria uma conta para deixar o teu gosto nos comentários dos artigos."
        redirectTo={postId ? `/posts/${postId}` : undefined}
      />
    </>
  );
}