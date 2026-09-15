"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  LockKeyhole,
  UserRound,
  Sparkles,
} from "lucide-react";
import { signup } from "@/lib/api";

function SignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !username.trim() || !password) {
      setError("Por favor preenche todos os campos obrigatórios.");
      return;
    }

    if (password.length < 6) {
      setError("A palavra-passe deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      await signup(
        firstName.trim(),
        lastName.trim(),
        username.trim().toLowerCase(),
        password
      );

      // Redirect to login page with registered=true flag
      const loginUrl = `/login?registered=true${
        redirect !== "/" ? `&redirect=${encodeURIComponent(redirect)}` : ""
      }`;
      router.push(loginUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível criar a conta. Por favor tenta novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Editorial side banner (desktop only) */}
      <section className="relative hidden overflow-hidden bg-gray-900 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.18),transparent_40%)]" />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
              <BookOpen size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Editorial
            </span>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-950/40 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles size={12} />
              <span>Registo de Leitor</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Cria a tua conta e faz ouvir a tua voz.
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Junta-te a milhares de leitores apaixonados por conhecimento. Cria a tua conta gratuita para comentar e interagir em todos os artigos.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Editorial Blog &bull; Comunidade aberta
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <BookOpen size={18} />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Editorial
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              Criar conta
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Preenche os dados abaixo para te registares como leitor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Nome próprio
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setError("");
                  }}
                  placeholder="ex: João"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Apelido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setError("");
                  }}
                  placeholder="ex: Silva"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-username"
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
                  id="signup-username"
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
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Palavra-passe (mínimo 6 caracteres)
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Confirmar palavra-passe
              </label>
              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Repete a palavra-passe"
                  disabled={isLoading}
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800/80 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-indigo-400"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 dark:border-red-950/50 dark:bg-red-950/30">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span>{isLoading ? "A criar conta..." : "Criar conta de leitor"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-8 space-y-3 text-center text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              Já tens conta?{" "}
              <Link
                href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Iniciar sessão
              </Link>
            </p>

            <div>
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                &larr; Voltar à página principal
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50 dark:bg-gray-900" />}>
      <SignupForm />
    </Suspense>
  );
}
