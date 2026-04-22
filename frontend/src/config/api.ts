import { NativeModules, Platform } from "react-native";

const API_PORT = 3000;
const API_PATH = "/api";
const LOCALHOST_HOSTS = new Set(["localhost", "127.0.0.1"]);
const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

function extractHostFromUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).hostname || null;
  } catch {
    const matchedHost = value.match(/^[a-z]+:\/\/(\[[^\]]+\]|[^/:]+)/i)?.[1];
    return matchedHost?.replace(/^\[|\]$/g, "") || null;
  }
}

function getDevServerHost() {
  const webOrigin = (globalThis as { location?: { origin?: string } }).location?.origin;

  if (Platform.OS === "web" && webOrigin) {
    return extractHostFromUrl(webOrigin);
  }

  const scriptUrl = NativeModules.SourceCode?.scriptURL as string | undefined;
  return extractHostFromUrl(scriptUrl);
}

function resolveApiHost() {
  const devServerHost = getDevServerHost();

  if (devServerHost && !LOCALHOST_HOSTS.has(devServerHost)) {
    return devServerHost;
  }

  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return devServerHost || "localhost";
}

export const API_HOST = resolveApiHost();
export const API_BASE_URL = envBaseUrl || `http://${API_HOST}:${API_PORT}${API_PATH}`;
