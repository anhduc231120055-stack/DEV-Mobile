import React, { useMemo, useState } from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { Booking, BookingStatus } from "../../types/models";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Bookings">;

function getStatusTone(status: BookingStatus) {
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return "success" as const;
  }

  if (status === "PENDING") {
    return "warning" as const;
  }

  return "danger" as const;
}

export function BookingHistoryScreen({ navigation }: Props) {
  const { bookingError, bookings, cancelMyBooking, isBookingsLoading } = useAppContext();
  const [filter, setFilter] = useState<BookingStatus | "ALL">("ALL");

  const visibleBookings = useMemo(() => {
    if (filter === "ALL") {
      return bookings;
    }

    return bookings.filter((booking) => booking.status === filter);
  }, [bookings, filter]);

  async function handleCancel(booking: Booking) {
    if (booking.status !== "PENDING") {
      return;
    }

    await cancelMyBooking(booking.id);
  }

  return (
    <Screen>
      <AppHeader
        title="Lich su dat tour"
        subtitle="Theo doi cac don da dat va cap nhat trang thai moi nhat."
      />

      <View style={styles.filterRow}>
        <ActionChip label="Tat ca" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
        <ActionChip label="Pending" active={filter === "PENDING"} onPress={() => setFilter("PENDING")} />
        <ActionChip label="Confirmed" active={filter === "CONFIRMED"} onPress={() => setFilter("CONFIRMED")} />
        <ActionChip label="Completed" active={filter === "COMPLETED"} onPress={() => setFilter("COMPLETED")} />
      </View>

      {bookingError ? <Text style={styles.errorText}>{bookingError}</Text> : null}

      {isBookingsLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai booking...</Text>
          <Text style={styles.loadingText}>He thong dang tai lich su dat tour cua ban.</Text>
        </View>
      ) : visibleBookings.length === 0 ? (
        <EmptyState
          title="Chua co booking nao"
          description="Khi dat tour thanh cong, booking se xuat hien tai day va cho phep theo doi trang thai thanh toan."
        />
      ) : (
        <View style={styles.list}>
          {visibleBookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardMeta}>
                  <Text style={styles.code}>BK-{booking.id}</Text>
                  <Text style={styles.title}>{booking.tourTitle ?? "Tour"}</Text>
                </View>
                <StatusBadge label={booking.status} tone={getStatusTone(booking.status)} />
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Ngay di</Text>
                  <Text style={styles.value}>{booking.travelDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Tong tien</Text>
                  <Text style={styles.value}>{booking.total}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>So khach</Text>
                  <Text style={styles.value}>{String(booking.numberOfPeople ?? 1)}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Diem den</Text>
                  <Text style={styles.value}>{booking.location ?? "Dang cap nhat"}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <Pressable style={styles.secondaryAction} onPress={() => navigation.getParent()?.navigate("BookingDetail", { bookingId: booking.id })}>
                  <Text style={styles.secondaryActionText}>Chi tiet</Text>
                </Pressable>
                <Pressable
                  disabled={booking.status !== "PENDING"}
                  style={[styles.dangerAction, booking.status !== "PENDING" && styles.disabledAction]}
                  onPress={() => void handleCancel(booking)}
                >
                  <Text style={styles.dangerActionText}>{booking.status === "PENDING" ? "Huy booking" : "Khong the huy"}</Text>
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
    borderRadius: 20,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cardMeta: {
    flex: 1,
    gap: 4,
  },
  code: {
    color: colors.secondary,
    fontWeight: "900",
  },
  title: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    width: "47%",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 12,
    gap: 4,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    color: colors.text,
    fontWeight: "800",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
  dangerAction: {
    flex: 1,
    backgroundColor: "#FDE9E2",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledAction: {
    opacity: 0.5,
  },
  dangerActionText: {
    color: colors.danger,
    fontWeight: "900",
  },
});
