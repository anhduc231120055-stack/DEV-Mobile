import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminTours">;

export function TourManagementScreen({ navigation }: Props) {
  const { tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Quản lý tour" subtitle="Từ `qu_n_l_tour_admin_responsive_layout`." onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {tours.map((tour) => (
          <View key={tour.id} style={styles.card}>
            <Text style={styles.title}>{tour.title}</Text>
            <Text style={styles.meta}>{tour.location} • {tour.duration}</Text>
            <Text style={styles.price}>{tour.price}</Text>
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
  title: { color: colors.primary, fontWeight: "900", fontSize: 17 },
  meta: { color: colors.textMuted },
  price: { color: colors.secondary, fontWeight: "900" },
});
