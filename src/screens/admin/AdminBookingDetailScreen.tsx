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
import { fetchAdminBookingDetail } from "../../services/bookings";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";
import type { BookingCustomer, BookingDetail, BookingStatus, PaymentRecord } from "../../types/models";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminBookingDetail">;

function getStatusTone(status: BookingStatus) {
  if (status === "CONFIRMED" || status === "COMPLETED") {
    return "success" as const;
  }

  if (status === "PENDING") {
    return "warning" as const;
  }

  return "danger" as const;
}

export function AdminBookingDetailScreen({ navigation, route }: Props) {
  const { bookingId } = route.params;
  const { token, updateBookingStatusByAdmin } = useAppContext();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadBooking() {
    if (!token) {
      setError("Ban can dang nhap admin de xem booking.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const detail = await fetchAdminBookingDetail(token, bookingId);
      setBooking(detail);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Khong the tai chi tiet booking.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBooking();
  }, [bookingId, token]);

  async function handleStatusUpdate(status: BookingStatus) {
    if (!booking) {
      return;
    }

    setIsUpdating(true);

    try {
      await updateBookingStatusByAdmin(booking.id, status);
      await loadBooking();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Screen>
      <AppHeader
        title="Chi tiet booking"
        subtitle="Admin detail nay doc GET /api/bookings/:id de hien thi don hang, customer va payment."
        onBack={() => navigation.goBack()}
        rightLabel="Tai lai"
        onRightPress={() => void loadBooking()}
      />

      {isLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai booking...</Text>
          <Text style={styles.loadingText}>Dang dong bo chi tiet don hang tu backend admin.</Text>
        </View>
      ) : !booking ? (
        <EmptyState title="Khong tim thay booking" description={error || "Booking nay khong ton tai hoac khong tai duoc."} />
      ) : (
        <>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={styles.heroMeta}>
                <Text style={styles.code}>BK-{booking.id}</Text>
                <Text style={styles.title}>{booking.customerName}</Text>
                <Text style={styles.subtitle}>{booking.tourTitle ?? "Tour"} | {booking.location ?? "Dang cap nhat"}</Text>
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

          <SectionTitle title="Lien he khach hang" />
          <View style={styles.panel}>
            <Row label="Ho ten" value={booking.customerName} />
            <Row label="Email" value={booking.userEmail || "Dang cap nhat"} />
            <Row label="So dien thoai" value={booking.userPhone || "Dang cap nhat"} />
            <Row label="Diem hen" value={booking.meetingPoint || "Dang cap nhat"} />
          </View>

          <SectionTitle title="Danh sach hanh khach" subtitle="Neu booking co `booking_customers`, admin se thay o day." />
          {!booking.customers?.length ? (
            <EmptyState title="Chua co hanh khach chi tiet" description="Backend chua tra ve danh sach hanh khach cho booking nay." />
          ) : (
            <View style={styles.list}>
              {booking.customers.map((customer) => (
                <CustomerCard key={customer.id} customer={customer} />
              ))}
            </View>
          )}

          <SectionTitle title="Thanh toan" />
          {!booking.payments?.length && !booking.latestPayment ? (
            <EmptyState title="Chua co payment" description="Booking nay chua co giao dich thanh toan nao trong he thong." />
          ) : (
            <View style={styles.list}>
              {(booking.payments?.length ? booking.payments : booking.latestPayment ? [booking.latestPayment] : []).map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.actionRow}>
            <Pressable
              disabled={isUpdating || booking.status === "CONFIRMED"}
              style={[styles.primaryAction, (isUpdating || booking.status === "CONFIRMED") && styles.disabledAction]}
              onPress={() => void handleStatusUpdate("CONFIRMED")}
            >
              <Text style={styles.primaryActionText}>Xac nhan</Text>
            </Pressable>
            <Pressable
              disabled={isUpdating || booking.status === "COMPLETED"}
              style={[styles.secondaryAction, (isUpdating || booking.status === "COMPLETED") && styles.disabledAction]}
              onPress={() => void handleStatusUpdate("COMPLETED")}
            >
              <Text style={styles.secondaryActionText}>Hoan tat</Text>
            </Pressable>
            <Pressable
              disabled={isUpdating || booking.status === "CANCELLED"}
              style={[styles.dangerAction, (isUpdating || booking.status === "CANCELLED") && styles.disabledAction]}
              onPress={() => void handleStatusUpdate("CANCELLED")}
            >
              <Text style={styles.dangerActionText}>Huy</Text>
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

function PaymentCard({ payment }: { payment: PaymentRecord }) {
  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentTop}>
        <Text style={styles.paymentMethod}>{payment.method}</Text>
        <StatusBadge label={payment.status} tone={payment.status === "SUCCESS" ? "success" : "warning"} />
      </View>
      <Row label="So tien" value={payment.amount} />
      <Row label="Thanh toan luc" value={payment.paidAt || "Dang cap nhat"} />
    </View>
  );
}

function CustomerCard({ customer }: { customer: BookingCustomer }) {
  return (
    <View style={styles.customerCard}>
      <Text style={styles.customerName}>{customer.fullName || "Hanh khach"}</Text>
      <Row label="Gioi tinh" value={customer.gender || "Dang cap nhat"} />
      <Row label="Ngay sinh" value={customer.birthDate || "Dang cap nhat"} />
      <Row label="So dien thoai" value={customer.phone || "Dang cap nhat"} />
      <Row label="Email" value={customer.email || "Dang cap nhat"} />
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
  list: {
    gap: 12,
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
  customerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  customerName: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
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
    borderRadius: 14,
    paddingVertical: 14,
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
