"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  function getPageTitle(pathname: string) {
    if (pathname === "/dashboard") {
      return "Dashboard";
    }

    if (pathname === "/dashboard/posts") {
      return "Posts";
    }

    if (pathname === "/dashboard/posts/new") {
      return "Escrever post";
    }

    if (pathname === "/dashboard/users") {
      return "Utilizadores";
    }

    if (pathname === "/dashboard/profile") {
      return "Perfil";
    }

    if (pathname.includes("/edit")) {
      return "Editar post";
    }

    if (
      pathname.startsWith("/dashboard/posts/") &&
      pathname !== "/dashboard/posts/new"
    ) {
      return "Post";
    }

    return "Dashboard";
  }

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {pageTitle}
          </h1>
        </div>

        {user && (
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user.username}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user.userType === "AUTHOR"
                  ? "Author"
                  : "Reader"}
              </p>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}