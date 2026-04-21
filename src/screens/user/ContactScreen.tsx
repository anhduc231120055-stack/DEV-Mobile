import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Contact">;

export function ContactScreen({}: Props) {
  return (
    <Screen>
      <AppHeader title="Liên hệ" subtitle="Màn mobile lấy ý tưởng từ `li_n_h_user`." />
      <View style={styles.form}>
        <TextInput placeholder="Họ và tên" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Nội dung" placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Gửi liên hệ</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
  },
  multiline: {
    minHeight: 140,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
