"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LogIn, UserPlus, X, Sparkles } from "lucide-react";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectTo?: string;
}

export default function AuthPromptModal({
  open,
  onClose,
  title = "Inicia sessão para continuar",
  description = "Precisas de ter sessão iniciada para poderes gostar de artigos, comentar e participar na discussão.",
  redirectTo,
}: AuthPromptModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";
  const signupHref = redirectTo
    ? `/signup?redirect=${encodeURIComponent(redirectTo)}`
    : "/signup";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="relative p-6 sm:p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <X size={18} />
          </button>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sparkles size={24} />
          </div>

          <h2
            id="auth-modal-title"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            {title}
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <Link
              href={loginHref}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </Link>

            <Link
              href={signupHref}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
            >
              <UserPlus size={16} />
              <span>Criar conta</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-3 text-center dark:border-gray-800 dark:bg-gray-900/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A leitura de todos os artigos é livre e não requer conta.
          </p>
        </div>
      </div>
    </div>
  );
}
