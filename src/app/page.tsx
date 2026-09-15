"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Clock, Heart, MessageCircle } from "lucide-react";
import { getPosts, getToken } from "@/lib/api";
import type { Post } from "@/types/post";
import PostGrid from "@/components/PostGrid";
import SearchBar from "@/components/SearchBar";
import { extractFirstImage, extractExcerpt, formatDate, getReadingTime } from "@/lib/postUtils";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError(null);
        const token = getToken();
        const data = await getPosts(token);
        setPosts(data);
      } catch (err) {
        console.error("Erro ao carregar artigos:", err);
        setError("Não foi possível carregar os artigos. Por favor tenta novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Filter posts by title (case-insensitive, trimmed)
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(query));
  }, [posts, searchQuery]);

  // If no search, highlight the latest post as featured if available
  const featuredPost = searchQuery.trim() === "" && posts.length > 0 ? posts[0] : null;
  const latestPosts = searchQuery.trim() === "" && posts.length > 1 ? posts.slice(1, 7) : filteredPosts;

  const featuredCover = featuredPost ? extractFirstImage(featuredPost.content) : null;
  const featuredExcerpt = featuredPost ? extractExcerpt(featuredPost.content, 220) : "";
  const featuredDate = featuredPost ? formatDate(featuredPost.timestamp, true) : "";
  const featuredReadingTime = featuredPost ? getReadingTime(featuredPost.content) : "";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-200/70 bg-gradient-to-b from-white via-indigo-50/20 to-transparent py-14 sm:py-20 lg:py-24 dark:border-gray-800/70 dark:from-[#11141A] dark:via-[#0F1115] dark:to-[#0F1115]">
        {/* Subtle Background Glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-sm dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Sparkles size={13} />
            <span>Bem-vindo ao Editorial</span>
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            Ideias, reflexões e histórias para mentes curiosas.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
            Explora artigos publicados pela nossa equipa, pesquisa temas do teu interesse e junta-te à comunidade deixando as tuas opiniões e gostos.
          </p>

          {/* Quick search in hero */}
          <div className="mx-auto mt-8 max-w-xl">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Pesquisar artigos por título..."
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Error notification */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/90 p-5 text-center text-sm font-medium text-red-700 dark:border-red-950/60 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Featured Article Banner (when not searching and posts exist) */}
        {!isLoading && featuredPost && !searchQuery.trim() && (
          <section className="mb-14 sm:mb-20">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                Artigo em destaque
              </h2>
            </div>

            <Link
              href={`/posts/${featuredPost.id}`}
              className="group relative flex min-h-[380px] w-full flex-col justify-end overflow-hidden rounded-3xl border border-gray-200/50 shadow-md transition-all duration-300 hover:shadow-2xl sm:min-h-[460px] lg:min-h-[500px] dark:border-gray-800/80"
            >
              {featuredCover ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${featuredCover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-gray-950" />
              )}

              <div className="relative z-10 p-6 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-200">
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-3 py-1 backdrop-blur-md">
                    <Clock size={12} />
                    {featuredReadingTime}
                  </span>
                  <span>{featuredDate}</span>
                </div>

                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white transition-colors group-hover:text-indigo-200 sm:text-3xl lg:text-4xl max-w-3xl">
                  {featuredPost.title}
                </h3>

                {featuredExcerpt && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-200/90 sm:text-base line-clamp-2">
                    {featuredExcerpt}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white backdrop-blur-sm">
                      {featuredPost.author?.firstName?.charAt(0) || "A"}
                      {featuredPost.author?.lastName?.charAt(0) || ""}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-semibold text-white">
                        {featuredPost.author?.firstName} {featuredPost.author?.lastName}
                      </p>
                      <p className="text-gray-300 opacity-80">
                        @{featuredPost.author?.username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium text-white">
                    <span className="flex items-center gap-1">
                      <Heart size={14} className={featuredPost.likesCount > 0 ? "fill-red-500 text-red-500" : ""} />
                      {featuredPost.likesCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />
                      {featuredPost.commentsCount}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-indigo-300 group-hover:translate-x-0.5 transition-transform">
                      Ler artigo <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Latest Posts Section */}
        <section>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                {searchQuery.trim() ? "Resultados da pesquisa" : "Últimos artigos"}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchQuery.trim()
                  ? `A mostrar artigos para "${searchQuery}"`
                  : "Explora as mais recentes publicações e reflexões."}
              </p>
            </div>

            {!searchQuery.trim() && posts.length > 7 && (
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <span>Ver todos os artigos</span>
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <PostGrid
            posts={searchQuery.trim() ? filteredPosts : latestPosts}
            isLoading={isLoading}
            emptyTitle={
              searchQuery.trim()
                ? "Nenhum artigo encontrado"
                : "Ainda não existem artigos publicados"
            }
            emptyMessage={
              searchQuery.trim()
                ? "Não encontramos artigos com esse título. Experimenta pesquisar por outros termos."
                : "Fica atento! Em breve teremos novos artigos disponíveis para leitura."
            }
          />

          {!isLoading && !searchQuery.trim() && posts.length > 7 && (
            <div className="mt-12 text-center">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/30"
              >
                <BookOpen size={16} />
                <span>Explorar todos os artigos ({posts.length})</span>
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
