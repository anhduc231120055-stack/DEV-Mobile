import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  label: string;
  active?: boolean;
  tone?: "primary" | "neutral" | "danger";
  onPress?: () => void;
};

export function ActionChip({ label, active = false, tone = "neutral", onPress }: Props) {
  const isPrimary = tone === "primary";
  const isDanger = tone === "danger";

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active && styles.chipActive,
        isPrimary && styles.chipPrimary,
        isDanger && styles.chipDanger,
      ]}
    >
      <Text
        style={[
          styles.label,
          active && styles.labelActive,
          isPrimary && styles.labelPrimary,
          isDanger && styles.labelDanger,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPrimary: {
    backgroundColor: "#FFF4D6",
    borderColor: "#F8D27A",
  },
  chipDanger: {
    backgroundColor: "#FDE9E2",
    borderColor: "#F4B6A1",
  },
  label: {
    color: colors.text,
    fontWeight: "700",
  },
  labelActive: {
    color: colors.surface,
  },
  labelPrimary: {
    color: "#925F00",
  },
  labelDanger: {
    color: colors.danger,
  },
});
