const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const getToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getToken();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result: ApiResponse<T> = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result.data;
};

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: "DELETE",
    }),
};
