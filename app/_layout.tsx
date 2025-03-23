import { Stack, router } from "expo-router";
import { RootSiblingParent } from "react-native-root-siblings";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { AppContextProvider } from "../context";
import { fetchToken } from "../helper";
import { axiosApi } from "../components/api";
import Toast from "react-native-root-toast";
import { IAuthProps } from "./model";
import React from "react";

export default function App() {
  const [auth, setAuth] = useState<IAuthProps | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [loading, setLoading] = useState(true);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/FiraCode-Regular.ttf"),
  });

  const addPushTokenToUser = async (pushToken: string) => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const res = await api.put(`/notification/save-token`, {
        pushToken,
      });
      return res?.data;
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      Toast.show(error.response.data, {
        backgroundColor: "red",
        textColor: "white",
      });
    } finally {
      setLoading(false);
    }
  };
  console.log({ auth });
  // Update the navigation in useEffect
  useEffect(() => {
    const initializeApp = async () => {
      const authStatus = await fetchToken();
      if (authStatus?.onboardingIncomplete) {
        setIsFirstLaunch(true);
        router.replace("/onboarding");
      } else if (authStatus?.loggedOut) {
        setIsFirstLaunch(false);
        setAuth({ role: "", token: "" });
        router.replace("/auth/login");
      } else if (authStatus?.token) {
        setIsFirstLaunch(false);
        setAuth({ token: authStatus.token, role: authStatus.role });
        switch (authStatus.role) {
          case "admin":
            router.replace("/(admin)");
            break;
          case "classRep":
            router.replace("/(classRep)");
            break;
          case "student":
            router.replace("/(student)");
            break;
        }
      }

      if (loaded) {
        SplashScreen.hideAsync();
      }
      setLoading(false);
    };
    initializeApp();
  }, [loaded]);

  useEffect(() => {
    const handlePushNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          alert(
            "Push notification permission is denied. Please enable notifications in your device settings."
          );
          return;
        }
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
        .data;

      if (token && auth) {
        await addPushTokenToUser(token);
      }
    };

    if (!isFirstLaunch && auth?.token) {
      handlePushNotifications();
    }
  }, [auth, isFirstLaunch]);

  if (!loaded || loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#9C27B0"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  // Update the Stack.Screen components
  return (
    <RootSiblingParent>
      <AppContextProvider>
        <Stack>
          <Stack.Screen name="(admin)" options={{ headerShown: false }} />
          <Stack.Screen name="(classRep)" options={{ headerShown: false }} />
          <Stack.Screen name="(student)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="hall" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
      </AppContextProvider>
    </RootSiblingParent>
  );
}
