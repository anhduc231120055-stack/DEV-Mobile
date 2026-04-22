import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { authError, authStatus, login } = useAppContext();
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSubmitting = authStatus === "loading";

  async function handleLogin() {
    await login(mode, {
      email: email.trim(),
      password,
    });
  }

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        title="Dang nhap"
        subtitle="Nhap thong tin tai khoan de tiep tuc."
      />

      <View style={styles.panel}>
        <View style={styles.modeRow}>
          <ActionChip label="Nguoi dung" active={mode === "user"} onPress={() => setMode("user")} />
          <ActionChip label="Admin" active={mode === "admin"} onPress={() => setMode("admin")} />
        </View>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Mat khau"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.helperRow}>
          <Text style={styles.helperLabel}>Trang thai</Text>
          <Text style={styles.helperValue}>{isSubmitting ? "Dang gui..." : "San sang"}</Text>
        </View>

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <Pressable disabled={isSubmitting} style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]} onPress={() => void handleLogin()}>
          <Text style={styles.primaryButtonText}>{isSubmitting ? "Dang dang nhap..." : mode === "user" ? "Dang nhap user" : "Dang nhap admin"}</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Pressable onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Chua co tai khoan? Dang ky</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: "center",
    flexGrow: 1,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
  },
  helperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
  },
  helperLabel: {
    color: colors.textMuted,
    fontWeight: "700",
  },
  helperValue: {
    color: colors.primary,
    fontWeight: "800",
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "900",
  },
  link: {
    color: colors.secondary,
    fontWeight: "700",
  },
  footerRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
