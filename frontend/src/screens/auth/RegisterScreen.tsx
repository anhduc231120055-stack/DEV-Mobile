import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  const { authError, authStatus, register } = useAppContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isSubmitting = authStatus === "loading";

  async function handleRegister() {
    await register({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      confirmPassword,
    });
  }

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        title="Dang ky"
        subtitle="Man nay da noi vao POST /api/auth/register va se vao thang app user neu tao tai khoan thanh cong."
        onBack={() => navigation.goBack()}
      />
      <View style={styles.panel}>
        <TextInput placeholder="Ho va ten" placeholderTextColor={colors.textMuted} style={styles.input} value={fullName} onChangeText={setFullName} />
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
          keyboardType="phone-pad"
          placeholder="So dien thoai"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput placeholder="Mat khau" placeholderTextColor={colors.textMuted} style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput
          placeholder="Nhap lai mat khau"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

        <Pressable disabled={isSubmitting} style={[styles.button, isSubmitting && styles.buttonDisabled]} onPress={() => void handleRegister()}>
          <Text style={styles.buttonText}>{isSubmitting ? "Dang tao tai khoan..." : "Tao tai khoan"}</Text>
        </Pressable>
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
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  button: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
