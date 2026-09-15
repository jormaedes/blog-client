"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { getToken, getUsers } from "@/lib/api";
import type { User } from "@/types/auth";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const data = await getUsers(token);

        setUsers(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Não foi possível carregar os utilizadores."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return users;
    }

    return users.filter((user) => {
      const fullName =
        `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        fullName.includes(normalizedSearch) ||
        user.username
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [users, search]);

  const authorCount = users.filter(
    (user) => user.userType === "AUTHOR"
  ).length;

  const readerCount = users.filter(
    (user) => user.userType === "READER"
  ).length;

  function getInitials(user: User) {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(
      0
    )}`.toUpperCase();
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Utilizadores
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consulta os utilizadores registados na plataforma.
          </p>
        </div>

        {!isLoading && !errorMessage && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {users.length}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Users
                    size={19}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Autores
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {authorCount}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/50">
                  <UserRound
                    size={19}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Leitores
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                    {readerCount}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <UserRound
                    size={19}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Todos os utilizadores
              </h2>

              {!isLoading && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1
                    ? "utilizador"
                    : "utilizadores"}
                </p>
              )}
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Pesquisar utilizadores..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  </div>

                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errorMessage}
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                <Search
                  size={18}
                  className="text-gray-400"
                />
              </div>

              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">
                Nenhum utilizador encontrado
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Tenta pesquisar por outro nome ou username.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    {getInitials(user)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </p>

                    <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={
                        user.userType === "AUTHOR"
                          ? "inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                          : "inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {user.userType === "AUTHOR"
                        ? "Autor"
                        : "Leitor"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}