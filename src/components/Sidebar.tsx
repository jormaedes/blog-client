"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuthStore from "@/stores/authStore";
import ThemeSwitcher from "@/components/ThemeSwitcher";

import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PenLine,
  User,
  Users,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Posts",
    href: "/dashboard/posts",
    icon: FileText,
  },
  {
    label: "Escrever post",
    href: "/dashboard/posts/new",
    icon: PenLine,
    authorOnly: true,
  },
  {
    label: "Utilizadores",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Perfil",
    href: "/dashboard/profile",
    icon: User,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  function handleLogout() {
    logout();
    onClose();
    router.replace("/login");
  }

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-200 ease-in-out
          dark:border-gray-800 dark:bg-gray-950
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Blog Admin
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden dark:hover:bg-gray-900 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {navigation.map((item) => {
                if (
                  item.authorOnly &&
                  user?.userType !== "AUTHOR"
                ) {
                  return null;
                }

                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(`${item.href}/`));

                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2
                        text-sm font-medium transition-colors
                        ${isActive
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
                        }
                      `}
                    >
                      <Icon size={18} strokeWidth={2} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <footer className="space-y-3">
            <ThemeSwitcher />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            >
              <LogOut size={18} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </footer>
        </div>
      </aside>
    </>
  );
}