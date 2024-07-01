import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import NotFoundScreen from "./+not-found";
import LoginScreen from "./auth/login";
import BookingScreen from "./hall/booking";
import CreateHallScreen from "./hall/create";
import HomeScreen from "./index";
import SignUpScreen from "./auth/signup";
import HallsScreen from "./hall/halls";

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [token, setToken] = useState<string>("");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("secret");
      if (storedToken) {
        const parsed = JSON.parse(storedToken);
        setToken(parsed.token);
      }
    } catch (error) {
      console.error("Failed to fetch token", error);
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem("secret");
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
        <Stack.Navigator>
          {token ? (
            <>
              <Stack.Screen
                name="hall/create"
                component={CreateHallScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="hall/halls"
                component={HallsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="bookHall"
                component={BookingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="+not-found"
                component={NotFoundScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="index"
                component={HomeScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/signup"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="+not-found"
                component={NotFoundScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </ThemeProvider>
    </RootSiblingParent>
  );
}
