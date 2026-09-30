"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X, ArrowRight } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const logout = useAuthStore((state) => state.logout);

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    logout();
    router.refresh();
  }

  const userInitials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() ||
      user.username?.charAt(0)?.toUpperCase() ||
      "U"
    : "";

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path === "/posts" && pathname.startsWith("/posts")) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-gray-800/80 dark:bg-[#0F1115]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center focus:outline-none">
            <div className="flex flex-col">
              <span className="font-serif text-xl text-gray-950 transition-colors group-hover:text-[#a5452e] sm:text-2xl dark:text-white dark:group-hover:text-[#df8064]">
                Editorial
              </span>
              <span className="hidden text-[10px] font-medium uppercase text-gray-500 sm:block dark:text-gray-400">
                Blog dos Leitores
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden h-16 items-center gap-2 md:flex">
            <Link
              href="/"
              className={`relative flex h-full items-center px-3 text-sm transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:bg-[#c2573a] after:transition-transform ${
                isActive("/")
                  ? "text-[#a5452e] after:scale-x-100 dark:text-[#df8064]"
                  : "text-gray-600 after:scale-x-0 hover:text-gray-950 hover:after:scale-x-100 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Início
            </Link>
            <Link
              href="/posts"
              className={`relative flex h-full items-center px-3 text-sm transition-colors after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-left after:bg-[#c2573a] after:transition-transform ${
                isActive("/posts")
                  ? "text-[#a5452e] after:scale-x-100 dark:text-[#df8064]"
                  : "text-gray-600 after:scale-x-0 hover:text-gray-950 hover:after:scale-x-100 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Artigos
            </Link>
          </nav>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeSwitcher />

          <div className="h-5 w-px bg-gray-200 dark:bg-gray-800" />

          {isAuthLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-gray-200/80 bg-gray-50/50 py-1.5 pl-2 pr-3 dark:border-gray-800 dark:bg-gray-900/50">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c2573a] text-xs font-semibold text-white">
                  {userInitials}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Terminar sessão"
                aria-label="Terminar sessão"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-red-900/50 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 rounded-md bg-[#c2573a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#a5452e]"
              >
                <span>Criar conta</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed inset-x-0 top-16 z-50 transform border-b border-gray-200 bg-white p-6 shadow-xl transition-all duration-300 ease-in-out md:hidden dark:border-gray-800 dark:bg-[#0F1115] ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <div className="flex flex-col space-y-4">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                isActive("/")
                  ? "bg-[#f8eee9] text-[#a5452e] dark:bg-[#38251f] dark:text-[#df8064]"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Início
            </Link>
            <Link
              href="/posts"
              onClick={() => setMobileMenuOpen(false)}
                className={`rounded-md px-4 py-3 text-base font-medium transition-colors ${
                isActive("/posts")
                  ? "bg-[#f8eee9] text-[#a5452e] dark:bg-[#38251f] dark:text-[#df8064]"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              Artigos
            </Link>
          </nav>

          <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
            {isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c2573a] text-sm font-semibold text-white">
                    {userInitials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                >
                  <LogOut size={16} />
                  Terminar sessão
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#c2573a] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#a5452e]"
                >
                  <span>Criar conta</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}