import React, { useMemo } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/common/AppHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { InfoCard } from "../../components/common/InfoCard";
import { Screen } from "../../components/common/Screen";
import { StatusBadge } from "../../components/common/StatusBadge";
import { useAppContext } from "../../context/AppContext";
import { colors } from "../../theme/colors";
import type { AdminStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<AdminStackParamList, "AdminAccountDetail">;

function formatCreatedAt(value?: string) {
  if (!value) {
    return "Dang cap nhat";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function AccountDetailScreen({ navigation, route }: Props) {
  const { accountId } = route.params;
  const { adminUsers, deleteUserByAdmin, isAdminLoading, updateUserRoleByAdmin } = useAppContext();

  const account = useMemo(() => adminUsers.find((item) => item.id === accountId) ?? null, [accountId, adminUsers]);

  if (!account) {
    return (
      <Screen>
        <AppHeader title="Chi tiet tai khoan" subtitle="Thong tin tai khoan se hien thi tai day." onBack={() => navigation.goBack()} />
        <EmptyState title="Khong tim thay tai khoan" description="Tai khoan nay khong ton tai hoac du lieu chua duoc tai xong." />
      </Screen>
    );
  }

  const canChangeRole = account.role !== "ADMIN";
  const nextRole = account.role === "USER" ? "STAFF" : "USER";

  return (
    <Screen>
      <AppHeader
        title="Chi tiet tai khoan"
        subtitle="Xem thong tin co ban va thuc hien cac thao tac quan tri cho tai khoan nay."
        onBack={() => navigation.goBack()}
      />

      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroText}>
            <Text style={styles.name}>{account.name}</Text>
            <Text style={styles.meta}>{account.email}</Text>
          </View>
          <StatusBadge label={account.role} tone={account.role === "ADMIN" ? "warning" : "success"} />
        </View>
      </View>

      <View style={styles.grid}>
        <InfoCard title="So dien thoai" value={account.phone || "Dang cap nhat"} />
        <InfoCard title="Ngay tao" value={formatCreatedAt(account.createdAt)} />
        <InfoCard title="Tong booking" value={String(account.totalBookings)} />
        <InfoCard title="Vai tro" value={account.role} />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Thao tac quan tri</Text>
        <Text style={styles.panelText}>Ban co the cap nhat quyen truy cap hoac xoa tai khoan neu can thiet.</Text>

        <View style={styles.actionRow}>
          {canChangeRole ? (
            <Pressable style={styles.secondaryAction} disabled={isAdminLoading} onPress={() => void updateUserRoleByAdmin(account.id, nextRole)}>
              <Text style={styles.secondaryActionText}>{account.role === "USER" ? "Cap quyen staff" : "Tra ve user"}</Text>
            </Pressable>
          ) : (
            <View style={[styles.secondaryAction, styles.disabledAction]}>
              <Text style={styles.secondaryActionText}>Tai khoan admin</Text>
            </View>
          )}

          <Pressable
            disabled={account.role === "ADMIN" || isAdminLoading}
            style={[styles.dangerAction, (account.role === "ADMIN" || isAdminLoading) && styles.disabledAction]}
            onPress={() => void deleteUserByAdmin(account.id)}
          >
            <Text style={styles.dangerActionText}>Xoa tai khoan</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  heroText: {
    flex: 1,
    gap: 6,
  },
  name: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: "900",
  },
  meta: {
    color: colors.textMuted,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "900",
  },
  panelText: {
    color: colors.textMuted,
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryActionText: {
    color: colors.primary,
    fontWeight: "900",
  },
  dangerAction: {
    flex: 1,
    backgroundColor: "#FDE9E2",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  dangerActionText: {
    color: colors.danger,
    fontWeight: "900",
  },
  disabledAction: {
    opacity: 0.45,
  },
});
