"use client";

import { useEffect, useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
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
    <div className="min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/50 dark:text-indigo-300">
            <BookOpen size={13} />
            <span>Biblioteca de Artigos</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Todos os artigos
          </h1>

          <p className="mt-3 max-w-2xl text-base text-gray-600 dark:text-gray-400">
            Navega por todos os artigos publicados, descobre novos conteúdos e aprofunda os teus conhecimentos.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-lg">
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Pesquisar artigos por título..."
            />
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50/90 p-5 text-center text-sm font-medium text-red-700 dark:border-red-950/60 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results summary when searching */}
        {!isLoading && searchQuery.trim() && (
          <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {filteredPosts.length === 1
                ? "1 artigo encontrado"
                : `${filteredPosts.length} artigos encontrados`}
            </span>
          </div>
        )}

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
