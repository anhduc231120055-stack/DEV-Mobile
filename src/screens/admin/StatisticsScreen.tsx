import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminStats">;

export function StatisticsScreen({ navigation }: Props) {
  const { adminError, adminStats, isAdminLoading } = useAppContext();

  return (
    <Screen>
      <AppHeader
        title="Thong ke"
        subtitle="Theo doi KPI quan trong de danh gia tinh hinh kinh doanh."
        onBack={() => navigation.goBack()}
      />

      <View style={styles.rangeRow}>
        <ActionChip label="Hom nay" />
        <ActionChip label="7 ngay" active />
        <ActionChip label="30 ngay" />
        <ActionChip label="Quy nay" />
      </View>

      <View style={styles.sourceCard}>
        <View style={styles.sourceHeader}>
          <Text style={styles.sourceTitle}>Tong quan du lieu</Text>
          <StatusBadge label={isAdminLoading ? "Dang dong bo" : "San sang"} tone="warning" />
        </View>
        <Text style={styles.sourceText}>
          {adminError || "Cac chi so ben duoi giup ban theo doi doanh thu, booking va hieu suat van hanh."}
        </Text>
      </View>

      <View style={styles.grid}>
        <InfoCard title="Tong doanh thu" value={adminStats?.totalRevenue ?? "0d"} />
        <InfoCard title="Tong booking" value={String(adminStats?.totalBookings ?? 0)} />
        <InfoCard title="Cho xu ly" value={String(adminStats?.pendingBookings ?? 0)} />
        <InfoCard title="Nguoi dung" value={String(adminStats?.totalUsers ?? 0)} />
      </View>

      <View style={styles.trendPanel}>
        <Text style={styles.trendTitle}>Canh bao van hanh</Text>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Booking cho thanh toan</Text>
          <Text style={styles.trendValue}>{String(adminStats?.pendingBookings ?? 0)}</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Booking da xac nhan</Text>
          <Text style={styles.trendValue}>{String(adminStats?.confirmedBookings ?? 0)}</Text>
        </View>
        <View style={styles.trendItem}>
          <Text style={styles.trendLabel}>Booking hoan tat</Text>
          <Text style={styles.trendValue}>{String(adminStats?.completedBookings ?? 0)}</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rangeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sourceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  sourceTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  sourceText: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  trendPanel: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    gap: 12,
  },
  trendTitle: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 18,
  },
  trendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  trendLabel: {
    color: "#D8E6F7",
    fontWeight: "700",
  },
  trendValue: {
    color: colors.secondary,
    fontWeight: "900",
    fontSize: 18,
  },
});
