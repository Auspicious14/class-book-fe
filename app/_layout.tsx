import React, { useState, useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  useNavigation,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { RootSiblingParent } from "react-native-root-siblings";
import { createStackNavigator } from "@react-navigation/stack";
import NotFoundScreen from "./+not-found";
import LoginScreen from "./auth/login";
import BookingScreen from "./hall/booking";
import CreateHallScreen from "./hall/create";
import HallsScreen from "./hall/halls";
import SignUpScreen from "./auth/signup";
import OnboardScreen from "./onboarding";
// import { router } from "expo-router";
import { fetchToken, isOnboardingComplete } from "../helper";
import { AppContextProvider } from "../context";

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router: any = useNavigation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [auth, setAuth] = useState<{ token: string; role: string }>({
    token: "",
    role: "",
  });
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await fetchToken();

      if (authStatus) {
        if (authStatus.onboardingIncomplete) {
          setIsFirstLaunch(true);
          router.navigate("onboarding/index");
        } else {
          setAuth({ token: authStatus.token, role: authStatus.role });
        }
      } else {
        setIsFirstLaunch(true);
        router.navigate("onboarding/index");
      }

      if (loaded) {
        SplashScreen.hideAsync();
      }
    };

    checkAuth();
  }, [loaded, auth]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContextProvider>
      <RootSiblingParent>
        <ThemeProvider value={DefaultTheme}>
          <Stack.Navigator>
            {isFirstLaunch ? (
              <>
                <Stack.Screen
                  name="onboarding/index"
                  component={OnboardScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/signup"
                  component={SignUpScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/login"
                  component={LoginScreen}
                  options={{ headerShown: false }}
                />
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
            ) : auth.token && auth.role === "admin" ? (
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
            ) : auth.token && auth.role === "classRep" ? (
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
            ) : auth.token && auth.role === "student" ? (
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
    </AppContextProvider>
  );
}
