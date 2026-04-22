import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminDashboard">;

export function AdminDashboardScreen({ navigation }: Props) {
  const { adminError, adminStats, currentUser, isAdminLoading, logout } = useAppContext();

  return (
    <Screen>
      <AppHeader
        title="Admin dashboard"
        subtitle="Theo doi tong quan hoat dong va truy cap nhanh cac cong cu quan tri."
        rightLabel="Dang xuat"
        onRightPress={logout}
      />

      <View style={styles.hero}>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Control tower</Text>
          <Text style={styles.heroSubtitle}>{currentUser?.email || "Dang tai thong tin tai khoan quan tri."}</Text>
        </View>
        <StatusBadge label={isAdminLoading ? "Dang dong bo" : "San sang"} tone="warning" />
      </View>

      {adminError ? <Text style={styles.errorText}>{adminError}</Text> : null}

      <View style={styles.stats}>
        <InfoCard title="Tours" value={String(adminStats?.totalTours ?? 0)} />
        <InfoCard title="Active tours" value={String(adminStats?.activeTours ?? 0)} />
        <InfoCard title="Bookings" value={String(adminStats?.totalBookings ?? 0)} />
        <InfoCard title="Users" value={String(adminStats?.totalUsers ?? 0)} />
      </View>

      <View style={styles.quickGrid}>
        <QuickAction label="Them tour moi" tone="primary" onPress={() => navigation.navigate("AdminTours")} />
        <QuickAction label="Duyet booking" tone="warning" onPress={() => navigation.navigate("AdminBookings")} />
        <QuickAction label="Cap role user" tone="neutral" onPress={() => navigation.navigate("AdminAccounts")} />
      </View>

      <View style={styles.menu}>
        <AdminLink label="Quan ly tour" description="Xem danh sach tour, cap nhat trang thai va dieu chinh noi dung." onPress={() => navigation.navigate("AdminTours")} />
        <AdminLink label="Quan ly booking" description="Theo doi don hang va cap nhat tien do xu ly cho tung booking." onPress={() => navigation.navigate("AdminBookings")} />
        <AdminLink label="Quan ly tai khoan" description="Kiem tra tai khoan, phan quyen va xu ly cac truong hop can can thiep." onPress={() => navigation.navigate("AdminAccounts")} />
        <AdminLink label="Quan ly review" description="Theo doi danh gia cua khach hang va chuan bi cho cong tac kiem duyet." onPress={() => navigation.navigate("AdminReviews")} />
        <AdminLink label="Thong ke" description="Xem nhanh KPI quan trong de danh gia hieu qua van hanh." onPress={() => navigation.navigate("AdminStats")} />
      </View>
    </Screen>
  );
}

function QuickAction({ label, onPress, tone }: { label: string; onPress: () => void; tone: "primary" | "warning" | "neutral" }) {
  return (
    <Pressable
      style={[
        styles.quickAction,
        tone === "primary" && styles.quickActionPrimary,
        tone === "warning" && styles.quickActionWarning,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.quickActionText, tone === "warning" && styles.quickActionTextWarning]}>{label}</Text>
    </Pressable>
  );
}

function AdminLink({ label, description, onPress }: { label: string; description: string; onPress: () => void }) {
  return (
    <Pressable style={styles.link} onPress={onPress}>
      <View style={styles.linkBody}>
        <Text style={styles.linkText}>{label}</Text>
        <Text style={styles.linkDescription}>{description}</Text>
      </View>
      <Text style={styles.linkArrow}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    gap: 12,
  },
  heroText: {
    gap: 6,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "900",
  },
  heroSubtitle: {
    color: "#D7E5F5",
    lineHeight: 21,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    padding: 16,
  },
  quickActionPrimary: {
    backgroundColor: "#FFF4D6",
  },
  quickActionWarning: {
    backgroundColor: "#FDE9E2",
  },
  quickActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
  quickActionTextWarning: {
    color: colors.danger,
  },
  menu: {
    gap: 12,
  },
  link: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkBody: {
    flex: 1,
    gap: 6,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.primary,
  },
  linkDescription: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  linkArrow: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.secondary,
  },
});
