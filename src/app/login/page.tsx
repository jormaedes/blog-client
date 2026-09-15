"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";

import { login } from "@/lib/api";
import useAuthStore from "@/stores/authStore";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const data = await login(username, password);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Não foi possível iniciar sessão.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] dark:bg-[#0F1115]">
      <div className="flex min-h-screen">
        {/* Visual */}
        <section className="relative hidden overflow-hidden bg-[#111827] lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(79,70,229,0.16),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-950/30">
                  <span className="text-lg font-bold">B</span>
                </div>

                <span className="text-lg font-semibold text-white">
                  Blog Admin
                </span>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
                Administration
              </p>

              <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white xl:text-5xl">
                Gere o teu conteúdo
                <br />
                de forma simples.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-gray-400">
                Cria, edita e publica os teus artigos num único
                espaço, com tudo o que precisas para gerir o teu blog.
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Blog Administration Platform
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="flex w-full items-center justify-center px-5 py-10 sm:px-8 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <span className="text-lg font-bold">B</span>
                </div>

                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Blog Admin
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Bem-vindo de volta
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Inicia sessão para aceder ao painel de administração.
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Username
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setError("");
                    }}
                    placeholder="O teu username"
                    disabled={isLoading}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="A tua password"
                    disabled={isLoading}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-600 dark:focus:border-indigo-400"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-950/50 dark:bg-red-950/30">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isLoading ? "A iniciar sessão..." : "Iniciar sessão"}
                </span>

                {!isLoading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-5 text-gray-400 dark:text-gray-600">
              Acesso restrito aos autores do blog.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}