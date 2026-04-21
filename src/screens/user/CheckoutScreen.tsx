import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppHeader } from "../../components/common/AppHeader";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { UserStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<UserStackParamList, "Checkout">;

export function CheckoutScreen({ navigation }: Props) {
  const { selectedTour } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Thanh toán" subtitle="Nối từ `thanh_to_n_user` sang form mobile." onBack={() => navigation.goBack()} />
      <SectionTitle title="Thông tin khách hàng" />
      <View style={styles.form}>
        <TextInput placeholder="Họ và tên" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Email" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Số điện thoại" placeholderTextColor={colors.textMuted} style={styles.input} />
        <TextInput placeholder="Ghi chú" placeholderTextColor={colors.textMuted} style={[styles.input, styles.multiline]} multiline />
      </View>
      <SectionTitle title="Tóm tắt đơn hàng" />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>{selectedTour?.title ?? "Chưa chọn tour"}</Text>
        <Text style={styles.summaryMeta}>{selectedTour?.duration ?? "--"} • {selectedTour?.location ?? "--"}</Text>
        <Text style={styles.summaryPrice}>{selectedTour?.price ?? "--"}</Text>
      </View>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Xác nhận thanh toán</Text>
      </Pressable>
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
    minHeight: 110,
    textAlignVertical: "top",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  summaryTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  summaryMeta: {
    color: colors.textMuted,
  },
  summaryPrice: {
    color: colors.secondary,
    fontWeight: "900",
    fontSize: 24,
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
    fontSize: 16,
  },
});
