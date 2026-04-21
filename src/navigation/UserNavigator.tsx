import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { BookingHistoryScreen } from "../screens/user/BookingHistoryScreen";
import { BookingDetailScreen } from "../screens/user/BookingDetailScreen";
import { CheckoutScreen } from "../screens/user/CheckoutScreen";
import { ContactScreen } from "../screens/user/ContactScreen";
import { HomeScreen } from "../screens/user/HomeScreen";
import { ProfileScreen } from "../screens/user/ProfileScreen";
import { TourDetailScreen } from "../screens/user/TourDetailScreen";
import { ToursScreen } from "../screens/user/ToursScreen";
import { colors } from "../theme/colors";
import type { MainTabParamList, UserStackParamList } from "./types";

const Stack = createNativeStackNavigator<UserStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

function icon(label: string, focused: boolean) {
  return <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>{label}</Text>;
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          backgroundColor: colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ", tabBarIcon: ({ focused }) => icon("🏠", focused) }}
      />
      <Tabs.Screen
        name="Tours"
        component={ToursScreen}
        options={{ title: "Tours", tabBarIcon: ({ focused }) => icon("🧭", focused) }}
      />
      <Tabs.Screen
        name="Bookings"
        component={BookingHistoryScreen}
        options={{ title: "Lịch sử", tabBarIcon: ({ focused }) => icon("📘", focused) }}
      />
      <Tabs.Screen
        name="Contact"
        component={ContactScreen}
        options={{ title: "Liên hệ", tabBarIcon: ({ focused }) => icon("💬", focused) }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Tài khoản", tabBarIcon: ({ focused }) => icon("👤", focused) }}
      />
    </Tabs.Navigator>
  );
}

export function UserNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="TourDetail" component={TourDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
    </Stack.Navigator>
  );
}
