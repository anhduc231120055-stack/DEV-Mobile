import { Platform } from "react-native";
import { Directory, File, Paths } from "expo-file-system";
import type { UserRole } from "../types/models";

type PersistedSession = {
  token: string;
  role: Extract<UserRole, "user" | "admin">;
};

const SESSION_DIRECTORY_NAME = "digital-voyager";
const SESSION_FILE_NAME = "session.json";
const WEB_STORAGE_KEY = "digital-voyager-session";

function getNativeSessionFile() {
  const directory = new Directory(Paths.document, SESSION_DIRECTORY_NAME);
  directory.create({ idempotent: true, intermediates: true });

  return new File(directory, SESSION_FILE_NAME);
}

function isPersistedSession(value: unknown): value is PersistedSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as PersistedSession;
  return typeof candidate.token === "string" && (candidate.role === "user" || candidate.role === "admin");
}

export async function loadPersistedSession(): Promise<PersistedSession | null> {
  try {
    if (Platform.OS === "web" && typeof globalThis.localStorage !== "undefined") {
      const rawValue = globalThis.localStorage.getItem(WEB_STORAGE_KEY);

      if (!rawValue) {
        return null;
      }

      const parsedValue = JSON.parse(rawValue);
      return isPersistedSession(parsedValue) ? parsedValue : null;
    }

    const file = getNativeSessionFile();

    if (!file.exists) {
      return null;
    }

    const rawValue = await file.text();
    const parsedValue = JSON.parse(rawValue);
    return isPersistedSession(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export async function persistSession(session: PersistedSession) {
  if (Platform.OS === "web" && typeof globalThis.localStorage !== "undefined") {
    globalThis.localStorage.setItem(WEB_STORAGE_KEY, JSON.stringify(session));
    return;
  }

  const file = getNativeSessionFile();

  if (!file.exists) {
    file.create({ overwrite: true, intermediates: true });
  }

  file.write(JSON.stringify(session), { encoding: "utf8" });
}

export async function clearPersistedSession() {
  if (Platform.OS === "web" && typeof globalThis.localStorage !== "undefined") {
    globalThis.localStorage.removeItem(WEB_STORAGE_KEY);
    return;
  }

  const file = getNativeSessionFile();

  if (file.exists) {
    file.delete();
  }
}
