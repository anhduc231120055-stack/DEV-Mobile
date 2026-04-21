import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { SectionTitle } from "../../components/common/SectionTitle";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { UserStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<UserStackParamList, "TourDetail">;

export function TourDetailScreen({ navigation }: Props) {
  const { selectedTour } = useAppContext();

  if (!selectedTour) {
    return (
      <View style={styles.empty}>
        <EmptyState title="Khong co tour duoc chon" description="Hay quay lai danh sach tour va chon mot diem den de xem chi tiet." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <AppHeader title="Chi tiet tour" subtitle="Man nay hien thi du lieu tour da map tu backend sang giao dien mobile." onBack={() => navigation.goBack()} />
      <Image source={{ uri: selectedTour.gallery[0] ?? selectedTour.image }} style={styles.heroImage} />

      <Text style={styles.title}>{selectedTour.title}</Text>
      <Text style={styles.meta}>
        {selectedTour.duration} • {selectedTour.location} • ★ {selectedTour.rating}
      </Text>
      <View style={styles.priceCard}>
        <Text style={styles.priceCaption}>Gia tu</Text>
        <Text style={styles.priceValue}>{selectedTour.price}</Text>
      </View>

      <SectionTitle title="Diem noi bat" subtitle={selectedTour.tagline} />
      <View style={styles.blockList}>
        {selectedTour.highlights.map((item) => (
          <View key={item} style={styles.highlight}>
            <Text style={styles.highlightBullet}>•</Text>
            <Text style={styles.highlightText}>{item}</Text>
          </View>
        ))}
      </View>

      <SectionTitle title="Lich trinh" />
      <View style={styles.blockList}>
        {selectedTour.itinerary.map((item) => (
          <View key={`${item.time}-${item.title}`} style={styles.timelineItem}>
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.timelineBody}>
              <Text style={styles.timelineTitle}>{item.title}</Text>
              <Text style={styles.timelineText}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.cta} onPress={() => navigation.navigate("Checkout")}>
        <Text style={styles.ctaText}>Tiep tuc dat tour</Text>
      </Pressable>
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
    gap: 18,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  heroImage: {
    width: "100%",
    height: 320,
    borderRadius: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.primary,
  },
  meta: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  priceCard: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  priceCaption: {
    color: "#BFD2EA",
    fontSize: 12,
  },
  priceValue: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "900",
  },
  blockList: {
    gap: 12,
  },
  highlight: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
  },
  highlightBullet: {
    color: colors.secondary,
    fontWeight: "900",
    fontSize: 20,
  },
  highlightText: {
    flex: 1,
    color: colors.text,
    lineHeight: 22,
    fontWeight: "600",
  },
  timelineItem: {
    flexDirection: "row",
    gap: 14,
  },
  time: {
    width: 70,
    paddingVertical: 10,
    textAlign: "center",
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    fontWeight: "900",
  },
  timelineBody: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  timelineTitle: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 16,
  },
  timelineText: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  cta: {
    marginTop: 6,
    backgroundColor: colors.secondary,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaText: {
    color: "#1F2937",
    fontWeight: "900",
    fontSize: 16,
  },
});
