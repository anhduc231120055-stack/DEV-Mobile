import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  label: string;
  tone?: "success" | "warning" | "danger" | "neutral";
};

export function StatusBadge({ label, tone = "neutral" }: Props) {
  return (
    <View
      style={[
        styles.badge,
        tone === "success" && styles.success,
        tone === "warning" && styles.warning,
        tone === "danger" && styles.danger,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === "success" && styles.successText,
          tone === "warning" && styles.warningText,
          tone === "danger" && styles.dangerText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
  },
  success: {
    backgroundColor: "#DDF6EE",
  },
  warning: {
    backgroundColor: "#FFF1CC",
  },
  danger: {
    backgroundColor: "#FDE9E2",
  },
  text: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 12,
  },
  successText: {
    color: colors.success,
  },
  warningText: {
    color: "#A16207",
  },
  dangerText: {
    color: colors.danger,
  },
});
