import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";
import type { BookingStatus } from "../../types/models";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminBookings">;

export function BookingManagementScreen({ navigation }: Props) {
  const { adminBookings, adminError, isAdminLoading, updateBookingStatusByAdmin } = useAppContext();
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  const visibleBookings = useMemo(() => {
    if (filter === "ALL") {
      return adminBookings;
    }

    return adminBookings.filter((booking) => booking.status === filter);
  }, [adminBookings, filter]);

  return (
    <Screen>
      <AppHeader
        title="Quan ly booking"
        subtitle="Theo doi danh sach don hang va cap nhat trang thai xu ly."
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filterRow}>
        <ActionChip label="Tat ca" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
        <ActionChip label="Pending" active={filter === "PENDING"} onPress={() => setFilter("PENDING")} />
        <ActionChip label="Confirmed" active={filter === "CONFIRMED"} onPress={() => setFilter("CONFIRMED")} />
        <ActionChip label="Completed" active={filter === "COMPLETED"} onPress={() => setFilter("COMPLETED")} />
      </View>

      {adminError ? <Text style={styles.errorText}>{adminError}</Text> : null}

      {isAdminLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai booking...</Text>
          <Text style={styles.loadingText}>He thong dang tai danh sach booking moi nhat.</Text>
        </View>
      ) : visibleBookings.length === 0 ? (
        <EmptyState title="Khong co booking nao" description="Danh sach don se hien o day khi he thong co du lieu." />
      ) : (
        <View style={styles.list}>
          {visibleBookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.metaBlock}>
                  <Text style={styles.code}>BK-{booking.id}</Text>
                  <Text style={styles.customer}>{booking.customerName}</Text>
                  <Text style={styles.meta}>{booking.tourTitle ?? "Tour"} • {booking.location ?? "Dang cap nhat"}</Text>
                </View>
                <StatusBadge label={booking.status} tone={booking.status === "PENDING" ? "warning" : "success"} />
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.meta}>{booking.travelDate}</Text>
                <Text style={styles.total}>{booking.total}</Text>
              </View>

              <View style={styles.actionRow}>
                <Pressable style={styles.primaryAction} onPress={() => void updateBookingStatusByAdmin(booking.id, "CONFIRMED")}>
                  <Text style={styles.primaryActionText}>Xac nhan</Text>
                </Pressable>
                <Pressable style={styles.secondaryAction} onPress={() => void updateBookingStatusByAdmin(booking.id, "COMPLETED")}>
                  <Text style={styles.secondaryActionText}>Hoan tat</Text>
                </Pressable>
                <Pressable style={styles.secondaryAction} onPress={() => navigation.navigate("AdminBookingDetail", { bookingId: booking.id })}>
                  <Text style={styles.secondaryActionText}>Chi tiet</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  metaBlock: {
    flex: 1,
    gap: 4,
  },
  code: {
    color: colors.secondary,
    fontWeight: "900",
  },
  customer: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meta: {
    color: colors.textMuted,
  },
  total: {
    color: colors.text,
    fontWeight: "900",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  primaryActionText: {
    color: colors.surface,
    fontWeight: "900",
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
});
