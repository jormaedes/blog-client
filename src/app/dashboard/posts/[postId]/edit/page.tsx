"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  FileText,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

import {
  getPost,
  getToken,
  togglePostPublished,
  updatePost,
} from "@/lib/api";
import type { Post } from "@/types/post";

import AuthorGuard from "@/components/AuthGuard";

export default function EditPostPage() {
  const params = useParams<{ postId: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!title.trim()) {
      setError("O título do post é obrigatório.");
      setSuccess("");
      return;
    }

    if (!content.trim()) {
      setError("O conteúdo do post é obrigatório.");
      setSuccess("");
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setIsSaving(true);
      setError("");
      setSuccess("");

      await updatePost(
        params.postId,
        title.trim(),
        content,
        token
      );

      setSuccess("Alterações guardadas com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Não foi possível guardar as alterações.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleTogglePublished() {
    if (!post) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        throw new Error("Authentication token not found");
      }

      setIsPublishing(true);
      setError("");
      setSuccess("");

      const updatedPost = await togglePostPublished(
        params.postId,
        !post.published,
        token
      );

      setPost(updatedPost);

      setSuccess(
        updatedPost.published
          ? "Post publicado com sucesso."
          : "Post despublicado com sucesso."
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Não foi possível atualizar o estado do post."
        );
      }
    } finally {
      setIsPublishing(false);
    }
  }

  useEffect(() => {
    async function loadPost() {
      try {
        const token = getToken();

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const data = await getPost(params.postId, token);

        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Não foi possível carregar o post.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [params.postId]);

  if (isLoading) {
    return (
      <main className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-6 h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />

            <div className="mb-6 flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-800" />

              <div className="space-y-2">
                <div className="h-7 w-40 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-4 h-12 w-full rounded bg-gray-200 dark:bg-gray-800" />
              </div>

              <div className="p-6">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-3 h-130 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-950/50 dark:bg-red-950/20">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Post não encontrado.
          </p>
        </div>
      </main>
    );
  }

  return (
    <AuthorGuard>
      <main className="min-h-full bg-gray-50/50 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/posts/${params.postId}`
                )
              }
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar para o post
            </button>

            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                  <FileText
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    Editar post
                  </h1>

                  <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                    Edita o conteúdo e o estado de publicação do teu artigo.
                  </p>
                </div>
              </div>

              <span
                className={
                  post.published
                    ? "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400"
                    : "inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                }
              >
                <span
                  className={
                    post.published
                      ? "h-1.5 w-1.5 rounded-full bg-green-500"
                      : "h-1.5 w-1.5 rounded-full bg-gray-400"
                  }
                />

                {post.published ? "Publicado" : "Rascunho"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Título
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="Título do post..."
                  disabled={isSaving}
                  className="mt-2 h-12 w-full border-0 bg-transparent px-0 text-2xl font-semibold tracking-tight text-gray-900 outline-none placeholder:text-gray-300 focus:ring-0 dark:text-white dark:placeholder:text-gray-600"
                />
              </div>

              <div className="px-6 py-5">
                <div className="mb-3">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Conteúdo
                  </label>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Atualiza o conteúdo do artigo usando o editor.
                  </p>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <Editor
                    apiKey="bonyjowkb1vp3xnp38zzgdi0z60j6djhppcw196jrszgik6i"
                    id="content"
                    value={content}
                    onEditorChange={(newContent) => {
                      setContent(newContent);
                      setError("");
                      setSuccess("");
                    }}
                    init={{
                      height: 520,
                      menubar: false,
                      entity_encoding: "raw",
                      plugins: [
                        "lists",
                        "link",
                        "image",
                        "table",
                        "code",
                      ],
                      toolbar:
                        "undo redo | blocks | bold italic | " +
                        "alignleft aligncenter alignright | " +
                        "bullist numlist | link image | code",
                      content_style:
                        "body { font-family: Inter, Arial, sans-serif; font-size: 16px; line-height: 1.7; padding: 8px 12px; }",
                    }}
                  />
                </div>
              </div>

              {(error || success) && (
                <div
                  className={
                    error
                      ? "border-t border-red-100 bg-red-50 px-6 py-4 dark:border-red-950/50 dark:bg-red-950/20"
                      : "border-t border-green-100 bg-green-50 px-6 py-4 dark:border-green-950/50 dark:bg-green-950/20"
                  }
                >
                  {error ? (
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                      <Check size={16} />
                      {success}
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Estado de publicação
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {post.published
                        ? "Este post está visível para os leitores."
                        : "Este post está guardado como rascunho."}
                    </p>
                  </div>

                  <div className="flex flex-col-reverse gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/dashboard/posts/${params.postId}`
                        )
                      }
                      disabled={isSaving || isPublishing}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <X size={16} />
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={handleTogglePublished}
                      disabled={isPublishing || isSaving}
                      className={
                        post.published
                          ? "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                          : "inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-indigo-200 px-4 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                      }
                    >
                      {isPublishing ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : post.published ? (
                        <X size={16} />
                      ) : (
                        <Send size={16} />
                      )}

                      {isPublishing
                        ? "A atualizar..."
                        : post.published
                          ? "Despublicar"
                          : "Publicar"}
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving || isPublishing}
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSaving ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Save size={16} />
                      )}

                      {isSaving
                        ? "A guardar..."
                        : "Guardar alterações"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </AuthorGuard>
  );
}