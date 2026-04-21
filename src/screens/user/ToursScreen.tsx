import React from "react";
import { StyleSheet, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { TourCard } from "../../components/tour/TourCard";
import { useAppContext } from "../../context/AppContext";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Tours">;

export function ToursScreen({ navigation }: Props) {
  const { tours, selectTour } = useAppContext();

  return (
    <Screen>
      <AppHeader title="Danh sách tour" subtitle="Nối từ `danh_s_ch_tour_user` sang luồng mobile dọc." />
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
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },
});
