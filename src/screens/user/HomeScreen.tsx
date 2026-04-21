import React from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AppHeader } from "../../components/common/AppHeader";
import { SectionTitle } from "../../components/common/SectionTitle";
import { useAppContext } from "../../context/AppContext";
import { categories } from "../../data/mockData";
import { colors } from "../../theme/colors";
import type { MainTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<MainTabParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { tours, selectTour } = useAppContext();
  const featuredTour = tours[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Digital Voyager" subtitle="Trang chủ mobile nối từ giao diện `trang_ch_user`." />

      {featuredTour ? (
        <ImageBackground source={{ uri: featuredTour.image }} style={styles.hero} imageStyle={styles.heroImage}>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Chạm đến chân trời mới</Text>
            <View style={styles.searchBox}>
              <TextInput editable={false} placeholder="Bạn muốn đi đâu?" placeholderTextColor="#8EA5C3" style={styles.input} />
              <Pressable onPress={() => navigation.navigate("Tours")} style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Khám phá</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      ) : null}

      <SectionTitle title="Khám phá theo sở thích" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((item) => (
          <View key={item.id} style={styles.categoryCard}>
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text style={styles.categoryLabel}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>

      <SectionTitle title="Điểm đến nổi bật" />
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
