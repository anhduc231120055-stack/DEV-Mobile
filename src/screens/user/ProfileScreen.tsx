import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Profile">;

export function ProfileScreen({}: Props) {
  const { bookings, logout, tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Tài khoản" subtitle="Tổng hợp nhanh trạng thái người dùng trong app mobile." />
      <View style={styles.statsRow}>
        <InfoCard title="Tour đang có" value={String(tours.length)} />
        <InfoCard title="Đơn đã tạo" value={String(bookings.length)} />
      </View>
      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  logoutButton: {
    backgroundColor: "#FDE2E2",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  logoutText: {
    color: "#9F1239",
    fontWeight: "900",
  },
});
