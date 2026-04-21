import React from "react";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Bookings">;

export function BookingHistoryScreen({}: Props) {
  const { bookings, tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Lịch sử đặt tour" subtitle="Màn mobile từ `l_ch_s_t_tour_user`." />
      <View style={styles.list}>
        {bookings.map((booking) => {
          const tour = tours.find((item) => item.id === booking.tourId);
          return (
            <View key={booking.id} style={styles.card}>
              <Text style={styles.code}>{booking.id}</Text>
              <Text style={styles.title}>{tour?.title ?? "Tour"}</Text>
              <Text style={styles.meta}>Ngày đi: {booking.travelDate}</Text>
              <Text style={styles.meta}>Tổng tiền: {booking.total}</Text>
              <Text style={styles.status}>{booking.status}</Text>
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    gap: 6,
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
  meta: {
    color: colors.textMuted,
  },
  status: {
    marginTop: 4,
    color: colors.success,
    fontWeight: "800",
  },
});
