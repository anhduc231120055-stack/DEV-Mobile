import React, { useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionChip } from "../../components/common/ActionChip";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";
import type { AdminUser } from "../../types/models";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminAccounts">;

export function AccountManagementScreen({ navigation }: Props) {
  const { adminError, adminUsers, deleteUserByAdmin, isAdminLoading, updateUserRoleByAdmin } = useAppContext();
  const [filter, setFilter] = useState<AdminUser["role"] | "ALL">("ALL");

  const visibleUsers = useMemo(() => {
    if (filter === "ALL") {
      return adminUsers;
    }

    return adminUsers.filter((user) => user.role === filter);
  }, [adminUsers, filter]);

  return (
    <Screen>
      <AppHeader
        title="Quan ly tai khoan"
        subtitle="Theo doi danh sach tai khoan va cap nhat quyen truy cap khi can."
        onBack={() => navigation.goBack()}
      />

      <View style={styles.filterRow}>
        <ActionChip label="Tat ca" active={filter === "ALL"} onPress={() => setFilter("ALL")} />
        <ActionChip label="User" active={filter === "USER"} onPress={() => setFilter("USER")} />
        <ActionChip label="Staff" active={filter === "STAFF"} onPress={() => setFilter("STAFF")} />
        <ActionChip label="Admin" active={filter === "ADMIN"} onPress={() => setFilter("ADMIN")} />
      </View>

      {adminError ? <Text style={styles.errorText}>{adminError}</Text> : null}

      {isAdminLoading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingTitle}>Dang tai danh sach user...</Text>
          <Text style={styles.loadingText}>He thong dang tai du lieu tai khoan moi nhat.</Text>
        </View>
      ) : visibleUsers.length === 0 ? (
        <EmptyState title="Khong co tai khoan nao" description="Danh sach nguoi dung se hien tai day khi he thong co du lieu." />
      ) : (
        <View style={styles.list}>
          {visibleUsers.map((account) => (
            <View key={account.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.nameBlock}>
                  <Text style={styles.name}>{account.name}</Text>
                  <Text style={styles.meta}>
                    {account.email} • {account.role}
                  </Text>
                </View>
                <StatusBadge label={`${account.totalBookings} bookings`} tone="success" />
              </View>

              <View style={styles.actionRow}>
                {account.role !== "ADMIN" ? (
                  <Pressable style={styles.secondaryAction} onPress={() => void updateUserRoleByAdmin(account.id, account.role === "USER" ? "STAFF" : "USER")}>
                    <Text style={styles.secondaryActionText}>{account.role === "USER" ? "Cap staff" : "Tra ve user"}</Text>
                  </Pressable>
                ) : (
                  <View style={styles.secondaryAction}>
                    <Text style={styles.secondaryActionText}>Admin core</Text>
                  </View>
                )}
                <Pressable style={styles.secondaryAction} onPress={() => navigation.navigate("AdminAccountDetail", { accountId: account.id })}>
                  <Text style={styles.secondaryActionText}>Chi tiet</Text>
                </Pressable>
                <Pressable disabled={account.role === "ADMIN"} style={[styles.dangerAction, account.role === "ADMIN" && styles.disabledAction]} onPress={() => void deleteUserByAdmin(account.id)}>
                  <Text style={styles.dangerActionText}>Xoa</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  errorText: {
    color: colors.danger,
    fontWeight: "700",
    lineHeight: 20,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadingTitle: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  loadingText: {
    color: colors.textMuted,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  nameBlock: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  meta: {
    color: colors.textMuted,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
  dangerAction: {
    flex: 1,
    backgroundColor: "#FDE9E2",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  disabledAction: {
    opacity: 0.45,
  },
  dangerActionText: {
    color: colors.danger,
    fontWeight: "900",
  },
});
