import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Profile">;

export function ProfileScreen({}: Props) {
  const { bookings, currentUser, logout, tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Tai khoan" subtitle="Quan ly thong tin ca nhan va theo doi hoat dong cua ban." />

      <View style={styles.identityCard}>
        <Text style={styles.name}>{currentUser?.name ?? "Khach"}</Text>
        <Text style={styles.meta}>{currentUser?.email ?? "Chua dang nhap"}</Text>
        <Text style={styles.role}>{currentUser?.role === "admin" ? "Tai khoan quan tri" : "Tai khoan nguoi dung"}</Text>
      </View>

      <View style={styles.statsRow}>
        <InfoCard title="Tour dang co" value={String(tours.length)} />
        <InfoCard title="Don da tao" value={String(bookings.length)} />
      </View>

      <Pressable style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Dang xuat</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identityCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 22,
  },
  meta: {
    color: colors.textMuted,
  },
  role: {
    marginTop: 4,
    color: colors.secondary,
    fontWeight: "800",
  },
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
