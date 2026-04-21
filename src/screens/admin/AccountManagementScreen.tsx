import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { Screen } from "../../components/common/Screen";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminAccounts">;

const accounts = [
  { id: "ACC-001", name: "Nguyễn Minh Anh", role: "User", status: "Active" },
  { id: "ACC-002", name: "Admin Voyager", role: "Admin", status: "Active" },
];

export function AccountManagementScreen({ navigation }: Props) {
  return (
    <Screen>
      <AppHeader title="Quản lý tài khoản" subtitle="Từ `qu_n_l_t_i_kho_n_admin_responsive_layout`." onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {accounts.map((account) => (
          <View key={account.id} style={styles.card}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.meta}>{account.id} • {account.role}</Text>
            <Text style={styles.status}>{account.status}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 6,
  },
  name: { color: colors.primary, fontWeight: "900", fontSize: 17 },
  meta: { color: colors.textMuted },
  status: { color: colors.success, fontWeight: "800" },
});
