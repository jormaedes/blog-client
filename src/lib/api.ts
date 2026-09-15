import type { LoginResponse, User } from "@/types/auth";
import type { Post } from "@/types/post";
import type { Comment, RecentComment } from "@/types/comment";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Credenciais inválidas");
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function signup(
  firstname: string,
  lastname: string,
  username: string,
  password: string
): Promise<{ message: string; user: User }> {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstname,
      lastname,
      username,
      password,
      user_type: "READER",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (response.status === 409) {
      throw new Error("Este nome de utilizador já se encontra em uso.");
    }
    throw new Error(
      errorData?.message || "Ocorreu um erro ao criar a conta. Tenta novamente."
    );
  }

  return response.json();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o utilizador atual");
  }

  return response.json();
}

export async function getPosts(token?: string | null): Promise<Post[]> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/posts`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar os artigos");
  }

  return response.json();
}

export async function getPost(postId: string, token?: string | null): Promise<Post> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/posts/${postId}`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Artigo não encontrado");
    }
    throw new Error("Falha ao carregar o artigo");
  }

  return response.json();
}

export async function updatePost(postId: string, title: string, content: string, token: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
}

export async function togglePostPublished(postId: string, published: boolean, token: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${postId}/publish`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      published,
    }),
  }
  );

  if (!response.ok) {
    throw new Error("Failed to update post publication status");
  }

  return response.json();
}

export async function deletePost(postId: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
}

export async function createPost(title: string, content: string, published: boolean, token: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
      content,
      published,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
}

export async function updateUser(
  userId: number,
  firstName: string,
  lastName: string,
  username: string,
  token: string,
  password?: string
): Promise<User> {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firstname: firstName,
      lastname: lastName,
      username,
      ...(password && { password }),
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Username already exists");
    }

    throw new Error("Failed to update user");
  }

  return response.json();
}

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get users");
  }

  return response.json();
}

export async function getComments(
  postId: string,
  token?: string | null
): Promise<Comment[]> {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    headers,
  });

  if (!response.ok) {
    throw new Error("Falha ao carregar os comentários");
  }

  return response.json();
}

export async function createComment(postId: string, content: string, token: string): Promise<Comment> {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

export async function deleteComment(commentId: number, token: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/comments/${commentId}/`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete comment");
  }
}

export async function updateComment(commentId: number, content: string, token: string): Promise<Comment> {
  const response = await fetch(
    `${API_URL}/comments/${commentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update comment");
  }

  return response.json();
}

export async function likePost(postId: string, token: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/posts/${postId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to like post");
  }
}

export async function unlikePost(postId: string, token: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/posts/${postId}/like`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unlike post");
  }
}

export async function likeComment(commentId: number, token: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/comments/${commentId}/like`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to like comment");
  }
}

export async function unlikeComment(commentId: number, token: string): Promise<void> {
  const response = await fetch(
    `${API_URL}/comments/${commentId}/like`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unlike comment");
  }
}

export async function getRecentComments(
  token: string
): Promise<RecentComment[]> {
  const response = await fetch(`${API_URL}/comments/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recent comments");
  }

  return response.json();
}
