import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAppContext } from "../context/AppContext";
import { AuthNavigator } from "./AuthNavigator";
import { UserNavigator } from "./UserNavigator";
import { AdminNavigator } from "./AdminNavigator";
import { colors } from "../theme/colors";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.text,
    border: colors.border,
  },
};

export function RootNavigator() {
  const { currentRole, isSessionBootstrapping } = useAppContext();

  if (isSessionBootstrapping) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Dang khoi phuc phien dang nhap...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentRole === "guest" ? <Stack.Screen name="Auth" component={AuthNavigator} /> : null}
        {currentRole === "user" ? <Stack.Screen name="User" component={UserNavigator} /> : null}
        {currentRole === "admin" ? <Stack.Screen name="Admin" component={AdminNavigator} /> : null}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: {
    color: colors.primary,
    fontWeight: "800",
  },
});
