import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { TourCard } from "../../components/tour/TourCard";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Tours">;

export function ToursScreen({ navigation, route }: Props) {
  const { isToursLoading, selectTour, tourError, tours } = useAppContext();
  const [searchQuery, setSearchQuery] = useState(route.params?.query ?? "");

  useEffect(() => {
    setSearchQuery(route.params?.query ?? "");
  }, [route.params?.query]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredTours = useMemo(() => {
    if (!normalizedQuery) {
      return tours;
    }

    return tours.filter((tour) =>
      [tour.title, tour.location, tour.tagline, tour.description ?? "", ...tour.highlights].some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [normalizedQuery, tours]);

  return (
    <Screen>
      <AppHeader title="Danh sach tour" subtitle="Loc tour theo dia diem, chu de hoac noi dung ban quan tam." />

      <View style={styles.searchCard}>
        <TextInput
          placeholder="Tim theo ten tour, dia diem, chu de..."
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Xoa</Text>
          </Pressable>
        ) : null}
      </View>

      {isToursLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang dong bo tour...</Text>
          <Text style={styles.loadingText}>Danh sach se cap nhat ngay khi du lieu san sang.</Text>
        </View>
      ) : tours.length === 0 ? (
        <EmptyState title="Khong co tour nao" description={tourError || "Khong lay duoc du lieu tour tu backend."} />
      ) : filteredTours.length === 0 ? (
        <EmptyState title="Khong tim thay tour phu hop" description={`Khong co ket qua cho "${searchQuery.trim()}".`} />
      ) : (
        <View style={styles.list}>
          {filteredTours.map((tour) => (
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
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
  },
  clearButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  clearButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
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
