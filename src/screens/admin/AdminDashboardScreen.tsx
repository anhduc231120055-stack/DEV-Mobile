import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminDashboard">;

export function AdminDashboardScreen({ navigation }: Props) {
  const { bookings, logout, tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Admin Dashboard" subtitle="Gom các màn admin thành một stack riêng." rightLabel="Đăng xuất" onRightPress={logout} />
      <View style={styles.stats}>
        <InfoCard title="Tours" value={String(tours.length)} />
        <InfoCard title="Bookings" value={String(bookings.length)} />
        <InfoCard title="Reviews" value="128" />
        <InfoCard title="Tài khoản" value="540" />
      </View>
      <View style={styles.menu}>
        <AdminLink label="Quản lý tour" onPress={() => navigation.navigate("AdminTours")} />
        <AdminLink label="Quản lý booking" onPress={() => navigation.navigate("AdminBookings")} />
        <AdminLink label="Quản lý tài khoản" onPress={() => navigation.navigate("AdminAccounts")} />
        <AdminLink label="Quản lý review" onPress={() => navigation.navigate("AdminReviews")} />
        <AdminLink label="Thống kê" onPress={() => navigation.navigate("AdminStats")} />
      </View>
    </Screen>
  );
}

function AdminLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.link} onPress={onPress}>
      <Text style={styles.linkText}>{label}</Text>
      <Text style={styles.linkArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  menu: {
    gap: 12,
  },
  link: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0D3B66",
  },
  linkArrow: {
    fontSize: 18,
    fontWeight: "900",
    color: "#F59E0B",
  },
});
