import { Platform } from "react-native";

const envBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

function resolveApiHost() {
  if (Platform.OS === "android") {
    return "10.0.2.2";
  }

  return "localhost";
}

export const API_HOST = resolveApiHost();
export const API_BASE_URL = envBaseUrl || `http://${API_HOST}:3000/api`;
