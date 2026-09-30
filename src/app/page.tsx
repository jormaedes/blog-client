"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Heart, MessageCircle } from "lucide-react";
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
      <section className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-semibold uppercase text-[#a5452e] dark:text-[#df8064]">
            Leituras para descobrir
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_22rem] md:items-end">
            <h1 className="max-w-3xl font-serif text-4xl leading-[1.12] text-gray-950 sm:text-5xl lg:text-6xl dark:text-white">
              Ideias, histórias e outras perspetivas.
          </h1>
            <div>
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                Artigos para ler com calma, guardar e partilhar.
              </p>
              <div className="mt-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Pesquisar artigos..."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Error notification */}
        {error && (
          <div className="mb-8 border-l-2 border-red-600 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Featured Article Banner (when not searching and posts exist) */}
        {!isLoading && featuredPost && !searchQuery.trim() && (
          <section className="mb-14 sm:mb-16">
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h2 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                Em destaque
              </h2>
            </div>

            <Link
              href={`/posts/${featuredPost.id}`}
              className="group relative flex min-h-90 w-full flex-col justify-end overflow-hidden rounded-md border border-gray-200/50 transition-colors sm:min-h-105 lg:min-h-115 dark:border-gray-800/80"
            >
              {featuredCover ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${featuredCover})` }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/60 to-black/20" />
                </>
              ) : (
                  <div className="absolute inset-0 bg-[#353a34]" />
              )}

                <div className="relative z-10 p-5 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-200">
                  <span className="inline-flex items-center gap-1 border border-white/25 bg-black/35 px-2.5 py-1">
                    <Clock size={12} />
                    {featuredReadingTime}
                  </span>
                  <span>{featuredDate}</span>
                </div>

                <h3 className="mt-4 max-w-3xl font-serif text-2xl leading-tight text-white transition-colors group-hover:text-[#ffd1c2] sm:text-3xl lg:text-4xl">
                  {featuredPost.title}
                </h3>

                {featuredExcerpt && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-200/90 sm:text-base line-clamp-2">
                    {featuredExcerpt}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                      {featuredPost.author?.firstName?.charAt(0) || "A"}
                      {featuredPost.author?.lastName?.charAt(0) || ""}
                    </div>
                    <div className="text-left text-xs">
                      <p className="font-semibold text-white">
                        {featuredPost.author?.firstName} {featuredPost.author?.lastName}
                      </p>
                      <p className="text-gray-300">
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
                      <span className="inline-flex items-center gap-1 font-semibold text-[#ffd1c2] group-hover:translate-x-0.5 transition-transform">
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
              <h2 className="font-serif text-2xl text-gray-950 sm:text-3xl dark:text-white">
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
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#a5452e] transition-colors hover:text-[#853b29] dark:text-[#df8064] dark:hover:text-[#f0987c]"
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
                className="inline-flex items-center gap-2 rounded-md bg-[#c2573a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#a5452e]"
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
