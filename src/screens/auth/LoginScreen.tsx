import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const { loginAsAdmin, loginAsUser } = useAppContext();

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        title="Đăng nhập"
        subtitle="Từ màn nguồn đăng nhập, tôi chuyển sang layout mobile và nối trực tiếp tới luồng user hoặc admin."
      />

      <View style={styles.panel}>
        <TextInput placeholder="Email hoặc số điện thoại" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Mật khẩu" placeholderTextColor={colors.textMuted} style={styles.input} secureTextEntry />

        <Pressable style={styles.primaryButton} onPress={loginAsUser}>
          <Text style={styles.primaryButtonText}>Vào app người dùng</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={loginAsAdmin}>
          <Text style={styles.secondaryButtonText}>Vào khu admin</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: "#FDE68A",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#78350F",
    fontWeight: "900",
  },
  link: {
    marginTop: 6,
    textAlign: "center",
    color: colors.secondary,
    fontWeight: "700",
  },
});
