"use client";

import { useEffect, useState, useMemo } from "react";
import { getPosts, getToken } from "@/lib/api";
import type { Post } from "@/types/post";
import PostGrid from "@/components/PostGrid";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

const POSTS_PER_PAGE = 9;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter posts by title (case-insensitive & trimmed)
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => post.title.toLowerCase().includes(query));
  }, [posts, searchQuery]);

  // Reset to page 1 whenever search query changes
  function handleSearchChange(query: string) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  return (
    <div className="min-h-screen py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 border-b border-gray-200 pb-8 sm:mb-12 sm:pb-10 dark:border-gray-800">
          <p className="text-xs font-semibold uppercase text-[#a5452e] dark:text-[#df8064]">
            Biblioteca editorial
          </p>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl leading-tight text-gray-950 sm:text-5xl dark:text-white">
                Todos os artigos
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                Leituras, ideias e perspetivas para levares contigo.
              </p>
            </div>
            <div className="w-full md:max-w-sm">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Pesquisar por título..."
              />
            </div>
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>Arquivo</span>
            {!isLoading && (
              <span>
                {filteredPosts.length} {filteredPosts.length === 1 ? "artigo" : "artigos"}
              </span>
            )}
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-8 border-l-2 border-red-600 bg-red-50 p-4 text-sm text-red-700 dark:border-red-400 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results summary when searching */}
        {/* Posts Grid */}
        <PostGrid
          posts={paginatedPosts}
          isLoading={isLoading}
          emptyTitle={
            searchQuery.trim()
              ? "Nenhum artigo encontrado"
              : "Ainda não existem artigos publicados"
          }
          emptyMessage={
            searchQuery.trim()
              ? "Não encontramos artigos com esse título. Experimenta pesquisar por outros termos."
              : "Fica atento! Novos artigos serão disponibilizados em breve."
          }
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </div>
  );
}
