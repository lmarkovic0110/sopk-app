import type { ApiResponse } from "@/types/api";

export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(path, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return (await response.json()) as ApiResponse<T>;
  } catch {
    return { success: false, message: "Network error." };
  }
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<ApiResponse<TResponse>> {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return (await response.json()) as ApiResponse<TResponse>;
  } catch {
    return { success: false, message: "Network error." };
  }
}
