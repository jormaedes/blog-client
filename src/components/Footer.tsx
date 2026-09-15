import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/80 bg-white transition-colors dark:border-gray-800/80 dark:bg-[#0C0E12]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand info */}
          <div className="md:col-span-6 lg:col-span-7">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <BookOpen size={16} />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Editorial
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Um espaço dedicado à partilha de ideias, tecnologia, inovação e histórias inspiradoras. Junta-te à conversa comentando e partilhando as tuas perspetivas.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Navegação
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Página inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Todos os artigos
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Iniciar sessão
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  Criar conta de leitor
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader highlights */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-200">
              Comunidade
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Lê artigos sem restrições. Inicia sessão para gostar e comentar nos teus artigos favoritos.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-100 pt-8 sm:flex-row dark:border-gray-800/60">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {currentYear} Editorial Blog. Todos os direitos reservados.
          </p>
          <p className="mt-4 flex items-center gap-1 text-xs text-gray-400 sm:mt-0 dark:text-gray-500">
            <span>Criado com dedicação para a comunidade de leitores</span>
            <Heart size={12} className="fill-red-500 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
