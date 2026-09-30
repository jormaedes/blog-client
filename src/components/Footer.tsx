import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-[#f5f4ef] transition-colors dark:border-gray-800 dark:bg-[#191c19]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand info */}
          <div className="md:col-span-6 lg:col-span-7">
            <Link href="/" className="inline-flex items-center">
              <span className="font-serif text-2xl text-gray-950 dark:text-white">
                Editorial
              </span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              Um espaço dedicado à partilha de ideias, tecnologia, inovação e histórias inspiradoras. Junta-te à conversa comentando e partilhando as tuas perspetivas.
            </p>
          </div>

          {/* Navigation links */}
          <div className="md:col-span-3 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase text-gray-900 dark:text-gray-200">
              Navegação
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-[#a5452e] dark:hover:text-[#df8064]"
                >
                  Página inicial
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="transition-colors hover:text-[#a5452e] dark:hover:text-[#df8064]"
                >
                  Todos os artigos
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="transition-colors hover:text-[#a5452e] dark:hover:text-[#df8064]"
                >
                  Iniciar sessão
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="transition-colors hover:text-[#a5452e] dark:hover:text-[#df8064]"
                >
                  Criar conta de leitor
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader highlights */}
          <div className="md:col-span-3 lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase text-gray-900 dark:text-gray-200">
              Comunidade
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              Lê artigos sem restrições. Inicia sessão para gostar e comentar nos teus artigos favoritos.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-800">
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
