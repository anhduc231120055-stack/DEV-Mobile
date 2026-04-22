import React from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import type { Tour } from "../../types/models";

type Props = {
  tour: Tour;
  onPress: (tour: Tour) => void;
};

export function TourCard({ tour, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(tour)} style={styles.card}>
      <ImageBackground source={{ uri: tour.image }} style={styles.image} imageStyle={styles.imageInner}>
        <View style={styles.overlay}>
          <Text style={styles.rating}>★ {tour.rating}</Text>
          <View style={styles.pricePill}>
            <Text style={styles.priceLabel}>Từ</Text>
            <Text style={styles.priceValue}>{tour.price}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.body}>
        <Text style={styles.title}>{tour.title}</Text>
        <Text style={styles.meta}>
          {tour.duration} • {tour.location}
        </Text>
        <Text style={styles.tagline}>{tour.tagline}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  image: {
    height: 250,
    justifyContent: "space-between",
  },
  imageInner: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  overlay: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(13, 59, 102, 0.22)",
  },
  rating: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  pricePill: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  priceLabel: {
    color: "#BFD2EA",
    fontSize: 11,
  },
  priceValue: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 18,
  },
  body: {
    padding: 18,
    gap: 8,
  },
  title: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 20,
  },
  meta: {
    color: colors.text,
    fontWeight: "700",
  },
  tagline: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
