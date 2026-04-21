import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { colors } from "../../theme/colors";
import type { AuthStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export function RegisterScreen({ navigation }: Props) {
  return (
    <Screen contentStyle={styles.content}>
      <AppHeader title="Đăng ký" subtitle="Khởi tạo tài khoản mới từ màn thiết kế `ng_k_user`." onBack={() => navigation.goBack()} />
      <View style={styles.panel}>
        <TextInput placeholder="Họ và tên" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Số điện thoại" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Mật khẩu" placeholderTextColor={colors.textMuted} style={styles.input} secureTextEntry />
        <Pressable style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Tạo tài khoản</Text>
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
  button: {
    marginTop: 6,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
