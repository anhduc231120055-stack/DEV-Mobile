import { API_BASE_URL } from "../config/api";

type RequestOptions = Omit<RequestInit, "headers" | "body"> & {
  token?: string | null;
  data?: unknown;
};

type ApiErrorPayload = {
  message?: string;
  errors?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(status: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
  };

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      body: options.data !== undefined ? JSON.stringify(options.data) : undefined,
    });
  } catch (error) {
    throw new ApiError(0, `Khong the ket noi toi ${url}. Kiem tra backend dang chay va host API da dung chua.`);
  }

  const payload = (await response.json().catch(() => null)) as T | ApiErrorPayload | null;

  if (!response.ok) {
    const errorPayload = (payload ?? {}) as ApiErrorPayload;
    throw new ApiError(
      response.status,
      errorPayload.message || "Khong the ket noi toi may chu.",
      errorPayload.errors
    );
  }

  return payload as T;
}
