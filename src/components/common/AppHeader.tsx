import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
};

export function AppHeader({ title, subtitle, onBack, rightLabel, onRightPress }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable onPress={onBack}>
            <Text style={styles.action}>← Quay lại</Text>
          </Pressable>
        ) : (
          <View />
        )}

        {rightLabel ? (
          <Pressable onPress={onRightPress}>
            <Text style={styles.action}>{rightLabel}</Text>
          </Pressable>
        ) : (
          <View />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  action: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.secondary,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
