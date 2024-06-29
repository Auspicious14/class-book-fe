import React, { useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";

import { useColorScheme } from "../hooks/useColorScheme";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { string } from "yup";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [token, setToken] = useState<string>("");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to fetch token", error);
    }
  };

  useEffect(() => {
    fetchToken();
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RootSiblingParent>
      <ThemeProvider value={DefaultTheme}>
        {token ? (
          <Stack>
            <Stack.Screen name="hall/create" options={{ headerShown: false }} />
            <Stack.Screen
              name="hall/booking"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        ) : (
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </Stack>
        )}
      </ThemeProvider>
    </RootSiblingParent>
  );
}
