import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { TourCard } from "../../components/tour/TourCard";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Tours">;

export function ToursScreen({ navigation }: Props) {
  const { isToursLoading, selectTour, tourError, tours } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Danh sach tour" subtitle="Man nay da doc tu GET /api/tours va giu lai luong dieu huong cu sang chi tiet tour." />

      {isToursLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang dong bo tour...</Text>
          <Text style={styles.loadingText}>UI dang cho response tu backend.</Text>
        </View>
      ) : tours.length === 0 ? (
        <EmptyState title="Khong co tour nao" description={tourError || "Khong lay duoc du lieu tour tu backend."} />
      ) : (
        <View style={styles.list}>
          {tours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              onPress={(item) => {
                selectTour(item);
                navigation.getParent()?.navigate("TourDetail");
              }}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
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
});
