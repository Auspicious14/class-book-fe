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
import WelcomeScreen from "./onboarding/welcome";
import OnboardScreen from "./onboarding";

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [auth, setAuth] = useState<{ token: string; role: string }>({
    token: "",
    role: "admin",
  });
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("secret");
      if (storedToken) {
        const parsed = JSON.parse(storedToken);
        setAuth({ token: parsed.token, role: parsed.role });
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
  }, [loaded, auth]);

  if (!loaded) {
    return null;
  }
  console.log(loaded, "tokk");
  return (
    <RootSiblingParent>
      <ThemeProvider value={DefaultTheme}>
        <Stack.Navigator>
          {auth.token && auth.role === "admin" ? (
            <>
              <Stack.Screen
                name="hall/halls"
                component={HallsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="hall/create"
                component={CreateHallScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="hall/booking"
                component={BookingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="+not-found"
                component={NotFoundScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : auth.token && auth.role == "classRep" ? (
            <>
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
          ) : auth.token && auth.role == "student" ? (
            <>
              <Stack.Screen
                name="hall/halls"
                component={HallsScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="onboarding/index"
                component={OnboardScreen}
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
