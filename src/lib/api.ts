import type { LoginResponse, User } from "@/types/auth";
import type { Post } from "@/types/post";
import type { Comment, RecentComment } from "@/types/comment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
      password
    }),
  });

  if (!response.ok) {
    throw new Error("Invalid credentials");
  }

  const data: LoginResponse = await response.json();

  if (data.user.userType !== "AUTHOR") {
    throw new Error(
      "Only authors can access the admin application"
    );
  }

  return data;
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get current user");
  }

  return response.json();
}

export async function getPosts(token: string): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get all posts");
  }

  return response.json();
}

export async function getPost(postId: string, token: string): Promise<Post> {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get post");
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

export async function getComments(postId: string, token: string): Promise<Comment[]> {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get comments");
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
