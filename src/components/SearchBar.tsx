"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Pesquisar artigos por título...",
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500">
        <Search size={18} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Pesquisar artigos por título"
        className="h-11 w-full rounded-md border border-gray-300/80 bg-white pl-11 pr-11 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#c2573a] focus:ring-2 focus:ring-[#c2573a]/15 dark:border-gray-700 dark:bg-[#1b1e1b] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#df8064]"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar pesquisa"
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
