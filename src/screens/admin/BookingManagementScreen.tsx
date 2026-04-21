import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminBookings">;

export function BookingManagementScreen({ navigation }: Props) {
  const { bookings } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Quản lý booking" subtitle="Từ `qu_n_l_t_tour_admin_responsive_layout`." onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {bookings.map((booking) => (
          <View key={booking.id} style={styles.card}>
            <Text style={styles.code}>{booking.id}</Text>
            <Text style={styles.customer}>{booking.customerName}</Text>
            <Text style={styles.meta}>{booking.travelDate} • {booking.total}</Text>
            <Text style={styles.status}>{booking.status}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 6,
  },
  code: { color: colors.secondary, fontWeight: "900" },
  customer: { color: colors.primary, fontWeight: "900", fontSize: 17 },
  meta: { color: colors.textMuted },
  status: { color: colors.success, fontWeight: "800" },
});
