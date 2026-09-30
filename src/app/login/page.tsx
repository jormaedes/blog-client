"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { login } from "@/lib/api";
import useAuthStore from "@/stores/authStore";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/";
  const registered = searchParams.get("registered") === "true";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      const data = await login(username.trim(), password);

      localStorage.setItem("token", data.token);
      setUser(data.user);

      router.push(redirect);
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível iniciar sessão. Verifica as tuas credenciais.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="absolute left-4 top-5 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-[#a5452e] sm:left-8 dark:text-gray-400 dark:hover:text-[#df8064]"
      >
        <ArrowLeft size={16} />
        <span>Voltar</span>
      </Link>

      <section className="w-full max-w-md">
        <div className="mb-8">
          <p className="mb-3 font-serif text-xl text-gray-950 dark:text-white">
            Editorial
          </p>
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-gray-950 sm:text-4xl dark:text-white">
              Iniciar sessão
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Introduz os teus dados para aceder à tua conta de leitor.
            </p>
          </div>

          {/* Registration success notice */}
          {registered && (
            <div className="mb-6 flex items-start gap-3 border-l-2 border-green-600 bg-green-50 p-4 dark:border-green-400 dark:bg-green-950/30">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600 dark:text-green-400" />
              <div className="text-sm text-green-800 dark:text-green-300">
                Conta criada com sucesso! Podes agora iniciar sessão.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Nome de utilizador
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  placeholder="ex: joaosilva"
                  disabled={isLoading}
                  className="h-11 w-full rounded-md border border-gray-300/80 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#c2573a] focus:ring-2 focus:ring-[#c2573a]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-[#1b1e1b] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#df8064]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Palavra-passe
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="A tua palavra-passe"
                  disabled={isLoading}
                  className="h-11 w-full rounded-md border border-gray-300/80 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#c2573a] focus:ring-2 focus:ring-[#c2573a]/15 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-[#1b1e1b] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#df8064]"
                />
              </div>
            </div>

            {error && (
              <div role="alert" className="border-l-2 border-red-600 bg-red-50 p-3.5 dark:border-red-400 dark:bg-red-950/30">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#c2573a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#a5452e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isLoading ? "A iniciar sessão..." : "Iniciar sessão"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Ainda não tens conta?{" "}
              <Link
                href={`/signup${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="font-semibold text-[#a5452e] hover:text-[#853b29] dark:text-[#df8064] dark:hover:text-[#f0987c]"
              >
                Criar uma conta
              </Link>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50 dark:bg-gray-900" />}>
      <LoginForm />
    </Suspense>
  );
}