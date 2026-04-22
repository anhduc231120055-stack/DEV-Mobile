import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AccountDetailScreen } from "../screens/admin/AccountDetailScreen";
import { AccountManagementScreen } from "../screens/admin/AccountManagementScreen";
import { AdminBookingDetailScreen } from "../screens/admin/AdminBookingDetailScreen";
import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { BookingManagementScreen } from "../screens/admin/BookingManagementScreen";
import { ReviewManagementScreen } from "../screens/admin/ReviewManagementScreen";
import { StatisticsScreen } from "../screens/admin/StatisticsScreen";
import { TourManagementScreen } from "../screens/admin/TourManagementScreen";
import type { AdminStackParamList } from "./types";

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminTours" component={TourManagementScreen} />
      <Stack.Screen name="AdminBookings" component={BookingManagementScreen} />
      <Stack.Screen name="AdminBookingDetail" component={AdminBookingDetailScreen} />
      <Stack.Screen name="AdminAccounts" component={AccountManagementScreen} />
      <Stack.Screen name="AdminAccountDetail" component={AccountDetailScreen} />
      <Stack.Screen name="AdminReviews" component={ReviewManagementScreen} />
      <Stack.Screen name="AdminStats" component={StatisticsScreen} />
    </Stack.Navigator>
  );
}
