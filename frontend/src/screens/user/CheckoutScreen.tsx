import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionTitle } from "../../components/common/SectionTitle";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { UserStackParamList } from "../../navigation/types";
import type { PaymentMethod } from "../../services/bookings";

type Props = NativeStackScreenProps<UserStackParamList, "Checkout">;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isFutureOrToday(dateText: string) {
  const inputDate = new Date(`${dateText}T00:00:00`);

  if (Number.isNaN(inputDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
}

export function CheckoutScreen({ navigation }: Props) {
  const { bookingError, createCheckout, currentUser, isCheckoutSubmitting, selectedTour } = useAppContext();
  const [travelDate, setTravelDate] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [formError, setFormError] = useState<string | null>(null);

  const paymentOptions: Array<{ label: string; value: PaymentMethod }> = useMemo(
    () => [
      { label: "Chuyen khoan", value: "BANK_TRANSFER" },
      { label: "MoMo", value: "MOMO" },
      { label: "VNPay", value: "VNPAY" },
      { label: "Tien mat", value: "CASH" },
    ],
    []
  );

  const parsedPeople = Math.max(1, Number(numberOfPeople) || 1);
  const unitPrice = selectedTour?.priceValue ?? null;
  const estimatedTotal =
    unitPrice === null
      ? selectedTour?.price ?? "Lien he"
      : `${new Intl.NumberFormat("vi-VN").format(unitPrice * parsedPeople)}d`;

  async function handleCheckout() {
    if (!selectedTour) {
      return;
    }

    const normalizedDate = travelDate.trim();

    if (!DATE_REGEX.test(normalizedDate)) {
      setFormError("Ngay khoi hanh phai dung dinh dang YYYY-MM-DD.");
      return;
    }

    if (!isFutureOrToday(normalizedDate)) {
      setFormError("Ngay khoi hanh phai la hom nay hoac mot ngay trong tuong lai.");
      return;
    }

    if (!Number.isInteger(parsedPeople) || parsedPeople <= 0) {
      setFormError("So luong khach phai la so nguyen duong.");
      return;
    }

    setFormError(null);

    await createCheckout({
      tourId: selectedTour.id,
      travelDate: normalizedDate,
      numberOfPeople: parsedPeople,
      paymentMethod,
    });

    navigation.navigate("MainTabs");
  }

  if (!selectedTour) {
    return (
      <Screen>
        <AppHeader title="Thanh toan" subtitle="Chon tour truoc khi tao booking." onBack={() => navigation.goBack()} />
        <EmptyState title="Chua chon tour" description="Quay lai danh sach tour va chon mot tour de tao booking va thanh toan." />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader
        title="Thanh toan"
        subtitle="Xac nhan thong tin dat tour va chon phuong thuc thanh toan phu hop."
        onBack={() => navigation.goBack()}
      />

      <SectionTitle title="Thong tin lien he" subtitle="Thong tin nay duoc su dung de lien he va xac nhan booking." />
      <View style={styles.contactCard}>
        <Row label="Khach dat" value={currentUser?.name || "Dang cap nhat"} />
        <Row label="Email" value={currentUser?.email || "Dang cap nhat"} />
        <Row label="So dien thoai" value={currentUser?.phone || "Dang cap nhat"} />
      </View>

      <SectionTitle title="Thong tin booking" subtitle="Nhap ngay khoi hanh va so luong khach cho chuyen di." />
      <View style={styles.form}>
        <TextInput
          placeholder="Ngay khoi hanh (YYYY-MM-DD)"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          value={travelDate}
          onChangeText={setTravelDate}
        />
        <TextInput
          placeholder="So luong khach"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          keyboardType="number-pad"
          value={numberOfPeople}
          onChangeText={setNumberOfPeople}
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Luu y</Text>
        <Text style={styles.infoText}>
          Vui long kiem tra ky ngay di, so khach va tong chi phi du kien truoc khi xac nhan.
        </Text>
        <Text style={styles.infoText}>
          Sau khi gui yeu cau, he thong se tao booking va cap nhat trang thai thanh toan tuong ung.
        </Text>
      </View>

      <SectionTitle title="Phuong thuc thanh toan" subtitle="Chon cach thanh toan tien loi nhat cho ban." />
      <View style={styles.chipRow}>
        {paymentOptions.map((option) => (
          <ActionChip
            key={option.value}
            label={option.label}
            active={paymentMethod === option.value}
            onPress={() => setPaymentMethod(option.value)}
          />
        ))}
      </View>

      <SectionTitle title="Tom tat don hang" />
      <View style={styles.summaryCard}>
        <View style={styles.summaryTop}>
          <View style={styles.summaryMetaBlock}>
            <Text style={styles.summaryTitle}>{selectedTour.title}</Text>
            <Text style={styles.summaryMeta}>
              {selectedTour.duration} | {selectedTour.location}
            </Text>
          </View>
          <StatusBadge label="PENDING" tone="warning" />
        </View>

        <View style={styles.lineItem}>
          <Text style={styles.lineLabel}>Gia tour</Text>
          <Text style={styles.lineValue}>{selectedTour.price}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.lineLabel}>So khach</Text>
          <Text style={styles.lineValue}>{String(parsedPeople)}</Text>
        </View>
        <View style={styles.lineItem}>
          <Text style={styles.lineLabel}>Phuong thuc</Text>
          <Text style={styles.lineValue}>{paymentMethod}</Text>
        </View>
        <View style={[styles.lineItem, styles.totalRow]}>
          <Text style={styles.totalLabel}>Tong du kien</Text>
          <Text style={styles.summaryPrice}>{estimatedTotal}</Text>
        </View>
      </View>

      {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
      {bookingError ? <Text style={styles.errorText}>{bookingError}</Text> : null}

      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Quay lai</Text>
        </Pressable>
        <Pressable disabled={isCheckoutSubmitting} style={[styles.button, isCheckoutSubmitting && styles.buttonDisabled]} onPress={() => void handleCheckout()}>
          <Text style={styles.buttonText}>{isCheckoutSubmitting ? "Dang xu ly..." : "Xac nhan dat tour"}</Text>
        </Pressable>
      </View>
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
  contactCard: {
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
  form: {
    gap: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: 20,
    padding: 18,
    gap: 8,
  },
  infoTitle: {
    color: colors.primary,
    fontWeight: "900",
  },
  infoText: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  summaryMetaBlock: {
    flex: 1,
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
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineLabel: {
    color: colors.textMuted,
  },
  lineValue: {
    color: colors.text,
    fontWeight: "700",
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    color: colors.primary,
    fontWeight: "800",
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
  button: {
    flex: 1.4,
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },
});
