import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  title: string;
  value: string;
};

export function InfoCard({ title, value }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  title: {
    color: colors.textMuted,
    fontWeight: "700",
    fontSize: 13,
  },
  value: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 18,
  },
});
