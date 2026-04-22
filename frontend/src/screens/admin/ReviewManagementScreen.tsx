import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminReviews">;

const reviews = [
  { id: "RV-001", author: "Le Bao", content: "Tour rat tot, dich vu on dinh.", rating: "5.0" },
  { id: "RV-002", author: "Mai Trang", content: "Can them thong tin ro hon ve lich trinh.", rating: "4.2" },
];

export function ReviewManagementScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader
        title="Quan ly review"
        subtitle="Theo doi danh gia cua khach hang va chuan bi cho cong tac kiem duyet."
        onBack={() => navigation.goBack()}
      />
      <View style={styles.list}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.card}>
            <Text style={styles.author}>{review.author}</Text>
            <Text style={styles.content}>{review.content}</Text>
            <Text style={styles.rating}>* {review.rating}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  author: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  content: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  rating: {
    color: colors.secondary,
    fontWeight: "900",
  },
});
