import React, { useState, useEffect } from "react";
import {
  DefaultTheme,
  ThemeProvider,
  useNavigation,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { RootSiblingParent } from "react-native-root-siblings";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router/stack";
import { fetchToken } from "../helper";
import { AppContextProvider } from "../context";
import { TouchableOpacity, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { useHomeState } from "./home/context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router: any = useNavigation();
  const { addPushTokenToUser } = useHomeState();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [auth, setAuth] = useState<{ token: string; role: string }>({
    token: "",
    role: "",
  });

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/FiraCode-Regular.ttf"),
  });

  useEffect(() => {
    const initializeApp = async () => {
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
        return;
      }

      const { status } = await Notifications.getPermissionsAsync();
      console.log(status, "status");
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();

        if (newStatus !== "granted") {
          console.log("Push notification permission denied");
          return;
        }
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);
      console.log(token);
      addPushTokenToUser(authStatus.token, token);
    };

    if (loaded && !auth.token) {
      initializeApp();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AppContextProvider>
      <RootSiblingParent>
        <ThemeProvider value={DefaultTheme}>
          <Stack
            screenOptions={{
              headerShown: true,
              statusBarColor: "#4CAF50",
              statusBarStyle: "auto",
              title: "",
              headerStyle: {
                backgroundColor: "#4CAF50",
              },

              headerRight: () => (
                <TouchableOpacity
                  onPress={() => router.navigate("profile/page")}
                  className="mx-4"
                >
                  <Ionicons
                    name="person-circle"
                    size={30}
                    color={"white"}
                    className="text-white"
                  />
                </TouchableOpacity>
              ),
            }}
          >
            {isFirstLaunch ? (
              <>
                <Stack.Screen
                  name="onboarding/index"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/signup"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/login"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="hall/detail" />
                <Stack.Screen name="hall/create" />
                <Stack.Screen name="hall/booking" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "admin" ? (
              <>
                <Stack.Screen
                  name="(tabs)/_layout"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="hall/detail" />
                <Stack.Screen name="hall/create" />
                <Stack.Screen name="profile/page" />
                <Stack.Screen name="hall/booking" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "classRep" ? (
              <>
                <Stack.Screen
                  name="(tabs)/_layout"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="hall/booking" />
                <Stack.Screen name="profile/page" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "student" ? (
              <>
                <Stack.Screen
                  name="(tabs)/_layout"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="hall/detail" />
                <Stack.Screen name="profile/page" />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="auth/login"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="auth/signup"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="+not-found"
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack>
        </ThemeProvider>
      </RootSiblingParent>
    </AppContextProvider>
  );
}
