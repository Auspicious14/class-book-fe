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
import { TouchableOpacity } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router: any = useNavigation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [auth, setAuth] = useState<{ token: string; role: string }>({
    token: "",
    role: "",
  });

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/FiraCode-Regular.ttf"),
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
    };

    if (loaded && !auth.token) {
      checkAuth();
      SplashScreen.hideAsync();
    }
  }, [loaded, auth.token]);

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
                <Stack.Screen name="hall/create" />
                <Stack.Screen name="hall/booking" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "admin" ? (
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="hall/create" />
                <Stack.Screen name="profile/page" />
                <Stack.Screen name="hall/booking" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "classRep" ? (
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="hall/page" />
                <Stack.Screen name="bookHall" />
                <Stack.Screen name="profile/page" />
                <Stack.Screen name="+not-found" />
              </>
            ) : auth.token && auth.role === "student" ? (
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="hall/page" />
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
