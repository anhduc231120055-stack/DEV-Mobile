import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminStats">;

export function StatisticsScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader title="Thống kê" subtitle="Từ `th_ng_k_admin_responsive_layout`." onBack={() => navigation.goBack()} />
      <View style={styles.grid}>
        <InfoCard title="Doanh thu tháng" value="420.000.000đ" />
        <InfoCard title="Tỉ lệ chuyển đổi" value="12.8%" />
        <InfoCard title="Đơn hoàn tất" value="186" />
        <InfoCard title="User mới" value="74" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
