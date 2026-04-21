import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  const { currentRole } = useAppContext();

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
