import React, { useMemo, useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionTitle } from "../../components/common/SectionTitle";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { isToursLoading, refreshTours, selectTour, tourError, tours } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const featuredTour = tours[0];
  const categorySuggestions = useMemo(() => buildCategorySuggestions(tours), [tours]);

  function handleSearch() {
    const query = searchQuery.trim();
    navigation.navigate("Tours", query ? { query } : undefined);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Digital Voyager" subtitle="Tim tour phu hop voi lich trinh va so thich cua ban." />

      {isToursLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai tour noi bat...</Text>
          <Text style={styles.loadingText}>He thong dang tai danh sach tour moi nhat.</Text>
        </View>
      ) : featuredTour ? (
        <ImageBackground source={{ uri: featuredTour.image }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Cham den chan troi moi</Text>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Ban muon di dau?"
                placeholderTextColor="#8EA5C3"
                style={styles.input}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <Pressable onPress={handleSearch} style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Kham pha</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      ) : (
        <EmptyState
          title="Chua co tour noi bat"
          description={tourError || "Danh sach tour hien trong. Kiem tra backend va thu tai lai."}
        />
      )}

      {tourError ? (
        <Pressable style={styles.retryButton} onPress={() => void refreshTours()}>
          <Text style={styles.retryButtonText}>Thu tai danh sach tour</Text>
        </Pressable>
      ) : null}

      <SectionTitle title="Kham pha theo so thich" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categorySuggestions.map((item) => (
          <Pressable key={item.id} style={styles.categoryCard} onPress={() => navigation.navigate("Tours", { query: item.query })}>
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionTitle title="Diem den noi bat" />
      <View style={styles.grid}>
        {tours.slice(0, 3).map((tour) => (
          <Pressable
            key={tour.id}
            onPress={() => {
              selectTour(tour);
              navigation.getParent()?.navigate("TourDetail");
            }}
            style={styles.destinationCard}
          >
            <ImageBackground source={{ uri: tour.image }} style={styles.destinationImage} imageStyle={styles.destinationImageInner}>
              <View style={styles.destinationOverlay}>
                <Text style={styles.destinationTitle}>{tour.title}</Text>
                <Text style={styles.destinationSubtitle}>{tour.location}</Text>
              </View>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 20,
  },
  loadingCard: {
    minHeight: 220,
    borderRadius: 28,
    padding: 22,
    justifyContent: "flex-end",
    backgroundColor: colors.primary,
    gap: 6,
  },
  loadingTitle: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: "900",
  },
  loadingText: {
    color: "#D7E5F5",
    lineHeight: 21,
  },
  hero: {
    minHeight: 360,
    justifyContent: "flex-end",
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    backgroundColor: "rgba(13, 59, 102, 0.34)",
    borderRadius: 28,
    padding: 22,
    gap: 18,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: "900",
    maxWidth: 240,
  },
  searchBox: {
    backgroundColor: colors.surface,
    padding: 10,
    borderRadius: 18,
    gap: 10,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.secondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  searchButtonText: {
    fontWeight: "900",
    color: "#1F2937",
  },
  retryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  retryButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  categoryRow: {
    gap: 12,
  },
  categoryCard: {
    width: 96,
    backgroundColor: colors.surface,
    borderRadius: 22,
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryLabel: {
    fontWeight: "700",
    color: colors.text,
  },
  grid: {
    gap: 14,
  },
  destinationCard: {
    borderRadius: 24,
    overflow: "hidden",
  },
  destinationImage: {
    minHeight: 180,
    justifyContent: "flex-end",
  },
  destinationImageInner: {
    borderRadius: 24,
  },
  destinationOverlay: {
    padding: 18,
    backgroundColor: "rgba(13, 59, 102, 0.24)",
  },
  destinationTitle: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: "900",
  },
  destinationSubtitle: {
    color: "#DDE7F3",
    marginTop: 4,
  },
});

type CategorySuggestion = {
  id: string;
  label: string;
  emoji: string;
  query: string;
};

function buildCategorySuggestions(tours: Array<{ title: string; location: string; tagline: string; highlights: string[] }>): CategorySuggestion[] {
  const fallback: CategorySuggestion[] = [
    { id: "bien", label: "Bien", emoji: "🏖️", query: "bien" },
    { id: "nghi-duong", label: "Nghi duong", emoji: "🌿", query: "nghi duong" },
    { id: "van-hoa", label: "Van hoa", emoji: "🏛️", query: "van hoa" },
    { id: "am-thuc", label: "Am thuc", emoji: "🍜", query: "am thuc" },
  ];

  const recipe = [
    { id: "bien", label: "Bien", emoji: "🏖️", keywords: ["bien", "dao", "san ho", "phu quoc", "ha long"] },
    { id: "nghi-duong", label: "Nghi duong", emoji: "🌿", keywords: ["nghi duong", "resort", "thu gian"] },
    { id: "van-hoa", label: "Van hoa", emoji: "🏛️", keywords: ["van hoa", "di tich", "kyoto", "tokyo"] },
    { id: "am-thuc", label: "Am thuc", emoji: "🍜", keywords: ["am thuc", "hai san", "dac san", "cho dem"] },
  ] satisfies Array<Omit<CategorySuggestion, "query"> & { keywords: string[] }>;

  const haystack = tours.map((tour) => `${tour.title} ${tour.location} ${tour.tagline} ${tour.highlights.join(" ")}`.toLowerCase());
  const matches = recipe
    .filter((item) => haystack.some((value) => item.keywords.some((keyword) => value.includes(keyword))))
    .map((item) => ({ id: item.id, label: item.label, emoji: item.emoji, query: item.label }));

  return matches.length > 0 ? matches : fallback;
}
