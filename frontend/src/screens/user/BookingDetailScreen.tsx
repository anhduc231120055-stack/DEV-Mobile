import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { SectionTitle } from "../../components/common/SectionTitle";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { fetchMyBookingDetail, fetchPaymentsByBooking } from "../../services/bookings";
import { colors } from "../../theme/colors";
import type { UserStackParamList } from "../../navigation/types";
import type { BookingDetail, BookingStatus, PaymentRecord } from "../../types/models";

type Props = NativeStackScreenProps<UserStackParamList, "BookingDetail">;

function getStatusTone(status: BookingStatus) {
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return "success" as const;
  }

  if (status === "PENDING") {
    return "warning" as const;
  }

  return "danger" as const;
}

export function BookingDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { cancelMyBooking, token } = useAppContext();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  async function loadBooking() {
    if (!token) {
      setError("Ban can dang nhap de xem booking.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const detail = await fetchMyBookingDetail(token, bookingId);
      setBooking(detail);

      try {
        const paymentHistory = await fetchPaymentsByBooking(token, bookingId);
        setPayments(paymentHistory);
      } catch {
        setPayments(detail.payments ?? (detail.latestPayment ? [detail.latestPayment] : []));
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Khong the tai chi tiet booking.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBooking();
  }, [bookingId, token]);

  async function handleCancel() {
    if (!booking || booking.status !== "PENDING") {
      return;
    }

    setIsCancelling(true);

    try {
      await cancelMyBooking(booking.id);
      await loadBooking();
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <Screen>
      <AppHeader
        title="Chi tiet booking"
        subtitle="Theo doi thong tin don hang, lien he va lich su thanh toan."
        onBack={() => navigation.goBack()}
        rightLabel="Tai lai"
        onRightPress={() => void loadBooking()}
      />

      {isLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai booking...</Text>
          <Text style={styles.loadingText}>He thong dang tai chi tiet booking cua ban.</Text>
        </View>
      ) : !booking ? (
        <EmptyState title="Khong tim thay booking" description={error || "Booking nay khong ton tai hoac ban khong co quyen xem."} />
      ) : (
        <>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroMeta}>
                <Text style={styles.code}>BK-{booking.id}</Text>
                <Text style={styles.title}>{booking.tourTitle ?? "Tour"}</Text>
                <Text style={styles.subtitle}>{booking.location ?? "Dang cap nhat"} | {booking.duration ?? "Dang cap nhat"}</Text>
              </View>
              <StatusBadge label={booking.status} tone={getStatusTone(booking.status)} />
            </View>

            <View style={styles.grid}>
              <InfoCard title="Ngay di" value={booking.travelDate} />
              <InfoCard title="Tong tien" value={booking.total} />
              <InfoCard title="So khach" value={String(booking.numberOfPeople ?? 1)} />
              <InfoCard title="Van chuyen" value={booking.transport || "Dang cap nhat"} />
            </View>
          </View>

          <SectionTitle title="Lien he" subtitle="Thong tin lien lac va diem hen cho chuyen di nay." />
          <View style={styles.panel}>
            <Row label="Khach dat" value={booking.customerName} />
            <Row label="Email" value={booking.userEmail || "Dang cap nhat"} />
            <Row label="So dien thoai" value={booking.userPhone || "Dang cap nhat"} />
            <Row label="Diem hen" value={booking.meetingPoint || "Dang cap nhat"} />
          </View>

          <SectionTitle title="Thanh toan" subtitle="Theo doi cac giao dich lien quan den booking nay." />
          {payments.length === 0 ? (
            <EmptyState title="Chua co thanh toan" description="Chua ghi nhan giao dich nao cho booking nay." />
          ) : (
            <View style={styles.list}>
              {payments.map((payment) => (
                <View key={payment.id} style={styles.paymentCard}>
                  <View style={styles.paymentTop}>
                    <Text style={styles.paymentMethod}>{payment.method}</Text>
                    <StatusBadge label={payment.status} tone={payment.status === "SUCCESS" ? "success" : "warning"} />
                  </View>
                  <Row label="So tien" value={payment.amount} />
                  <Row label="Thanh toan luc" value={payment.paidAt || "Dang cap nhat"} />
                </View>
              ))}
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionRow}>
            <Pressable style={styles.secondaryAction} onPress={() => navigation.navigate("MainTabs")}>
              <Text style={styles.secondaryActionText}>Ve danh sach</Text>
            </Pressable>
            <Pressable
              disabled={booking.status !== "PENDING" || isCancelling}
              style={[styles.dangerAction, (booking.status !== "PENDING" || isCancelling) && styles.disabledAction]}
              onPress={() => void handleCancel()}
            >
              <Text style={styles.dangerActionText}>{isCancelling ? "Dang huy..." : booking.status === "PENDING" ? "Huy booking" : "Khong the huy"}</Text>
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  heroMeta: {
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
    fontSize: 20,
  },
  subtitle: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  rowValue: {
    color: colors.text,
    fontWeight: "800",
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  paymentMethod: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: 16,
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
    paddingVertical: 16,
    alignItems: "center",
  },
  dangerActionText: {
    color: colors.danger,
    fontWeight: "900",
  },
  disabledAction: {
    opacity: 0.5,
  },
});
