"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, LogIn, UserPlus, X } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171914]/55 p-4 backdrop-blur-[2px] animate-in fade-in duration-200"
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
        className="w-full max-w-md overflow-hidden rounded-md border border-gray-200 bg-[#faf9f6] shadow-2xl transition-all dark:border-gray-700 dark:bg-[#191c19]"
      >
        <div className="relative p-6 sm:p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <X size={18} />
          </button>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f8eee9] text-[#a5452e] dark:bg-[#38251f] dark:text-[#df8064]">
            <Heart size={22} strokeWidth={1.8} />
          </div>

          <h2
            id="auth-modal-title"
            className="pr-8 font-serif text-2xl leading-tight text-gray-950 dark:text-white"
          >
            {title}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
            {description}
          </p>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
            <Link
              href={loginHref}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#c2573a] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#a5452e]"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </Link>

            <Link
              href={signupHref}
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300/80 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-[#1b1e1b] dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <UserPlus size={16} />
              <span>Criar conta</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-200 bg-[#f5f4ef] px-6 py-3 text-center dark:border-gray-800 dark:bg-[#141614]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            A leitura de todos os artigos é livre e não requer conta.
          </p>
        </div>
      </div>
    </div>
  );
}
