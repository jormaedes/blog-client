"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Lock,
  User,
} from "lucide-react";

import {
  getCurrentUser,
  getToken,
  updateUser,
} from "@/lib/api";

import useAuthStore from "@/stores/authStore";

interface ProfileForm {
  firstName: string;
  lastName: string;
  username: string;
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState<ProfileForm>({
    firstName: "",
    lastName: "",
    username: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const currentUser = await getCurrentUser(token);

        setForm({
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          username: currentUser.username,
        });

        setUser(currentUser);
      } catch (error) {
        console.error(error);
        setErrorMessage("Não foi possível carregar o perfil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [setUser]);

  function handleChange(
    field: keyof ProfileForm,
    value: string
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!form.firstName.trim()) {
      setErrorMessage("O primeiro nome é obrigatório.");
      return;
    }

    if (!form.lastName.trim()) {
      setErrorMessage("O apelido é obrigatório.");
      return;
    }

    if (!form.username.trim()) {
      setErrorMessage("O username é obrigatório.");
      return;
    }

    if (password && password.length < 6) {
      setErrorMessage(
        "A nova palavra-passe deve ter pelo menos 6 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        "A confirmação da palavra-passe não corresponde."
      );
      return;
    }

    try {
      const token = getToken();

      if (!token || !user) {
        return;
      }

      setIsSaving(true);

      const updatedUser = await updateUser(user.id, form.firstName, form.lastName, form.username, token, password??null);

      setUser(updatedUser);

      setForm({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
      });

      setPassword("");
      setConfirmPassword("");

      setSuccessMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      console.error(error);

      if (
        error instanceof Error &&
        error.message
      ) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Não foi possível atualizar o perfil."
        );
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-8 w-32 rounded-lg bg-gray-200 dark:bg-gray-800" />

          <div className="mt-8 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="h-36 border-b border-gray-200 dark:border-gray-800" />

            <div className="space-y-5 p-6">
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
              <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(
        0
      )}`.toUpperCase()
    : "?";

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Perfil
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gere as tuas informações pessoais e credenciais.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 px-6 py-6 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {initials}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </h2>

                <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                  @{user?.username}
                </p>

                <div className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
                  {user?.userType === "AUTHOR"
                    ? "Autor"
                    : "Leitor"}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <User
                    size={17}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Informações pessoais
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Atualiza os dados associados à tua conta.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Primeiro nome
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      handleChange(
                        "firstName",
                        event.target.value
                      )
                    }
                    disabled={isSaving}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Apelido
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(event) =>
                      handleChange(
                        "lastName",
                        event.target.value
                      )
                    }
                    disabled={isSaving}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(event) =>
                      handleChange(
                        "username",
                        event.target.value
                      )
                    }
                    disabled={isSaving}
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Lock
                    size={17}
                    className="text-gray-500 dark:text-gray-400"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Segurança
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    Deixa os campos vazios para manter a palavra-passe atual.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Nova palavra-passe
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                    disabled={isSaving}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Confirmar palavra-passe
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setSuccessMessage("");
                      setErrorMessage("");
                    }}
                    disabled={isSaving}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {(successMessage || errorMessage) && (
              <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                {successMessage && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
                    <Check size={16} />
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {errorMessage}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-950/40">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isSaving ? "A guardar..." : "Guardar alterações"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}