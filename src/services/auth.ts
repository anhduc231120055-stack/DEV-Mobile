import { apiRequest } from "./api";
import type { AppUser, UserRole } from "../types/models";

type LoginResponse = {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role?: string;
  };
  admin?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
};

type RegisterPayload = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

type MeResponse = {
  user?: LoginResponse["user"];
  admin?: LoginResponse["admin"];
};

type SessionPayload = Pick<LoginResponse, "user" | "admin">;

function normalizeRole(role?: string, isAdmin = false): UserRole {
  if (isAdmin) {
    return "admin";
  }

  return role?.toLowerCase() === "admin" ? "admin" : "user";
}

function normalizeUser(payload: SessionPayload): AppUser {
  if (payload.admin) {
    return {
      id: payload.admin.id,
      name: payload.admin.name,
      email: payload.admin.email,
      role: normalizeRole(payload.admin.role, true),
    };
  }

  if (!payload.user) {
    throw new Error("Phan hoi dang nhap khong co thong tin nguoi dung.");
  }

  return {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    phone: payload.user.phone,
    role: normalizeRole(payload.user.role),
  };
}

export async function loginUser(email: string, password: string) {
  const payload = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    data: { email, password },
  });

  return {
    token: payload.token,
    user: normalizeUser(payload),
  };
}

export async function loginAdmin(email: string, password: string) {
  const payload = await apiRequest<LoginResponse>("/admin-auth/login", {
    method: "POST",
    data: { email, password },
  });

  return {
    token: payload.token,
    user: normalizeUser(payload),
  };
}

export async function registerUser(data: RegisterPayload) {
  const payload = await apiRequest<LoginResponse>("/auth/register", {
    method: "POST",
    data,
  });

  return {
    token: payload.token,
    user: normalizeUser(payload),
  };
}

export async function fetchUserMe(token: string) {
  const payload = await apiRequest<MeResponse>("/auth/me", {
    method: "GET",
    token,
  });

  return normalizeUser(payload);
}

export async function fetchAdminMe(token: string) {
  const payload = await apiRequest<MeResponse>("/admin-auth/me", {
    method: "GET",
    token,
  });

  return normalizeUser(payload);
}
