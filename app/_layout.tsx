// import { Stack, router } from "expo-router";
// import { RootSiblingParent } from "react-native-root-siblings";
// import { ActivityIndicator } from "react-native";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { useEffect, useState } from "react";
// import { AppContextProvider } from "../context";
// import { fetchToken } from "../helper";
// import { axiosApi } from "../components/api";
// import Toast from "react-native-root-toast";
// import { IAuthProps } from "./model";
// import React from "react";
// import { useAuthState } from "./auth/context";

// const LoadAuth = () => {
//   const { auth, setAuth, loading, isFirstLaunch, setLoading } = useAuthState();
//   console.log({ loading, auth, isFirstLaunch });
//   if (loading) {
//     return (
//       <ActivityIndicator
//         size="large"
//         color="#9C27B0"
//         style={{ flex: 1, justifyContent: "center" }}
//       />
//     );
//   }

//   const addPushTokenToUser = async (pushToken: string) => {
//     setLoading(true);
//     try {
//       const { api } = await axiosApi();
//       const res = await api.put(`/notification/save-token`, {
//         pushToken,
//       });
//       return res?.data;
//     } catch (error: any) {
//       setLoading(false);
//       console.log({ error });
//       const errorMessage =
//         error?.response?.data?.message || error?.message || "An error occurred";
//       Toast.show(errorMessage, {
//         backgroundColor: "red",
//         textColor: "white",
//       });
//       console.log({ errorMessage });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const handlePushNotifications = async () => {
//       const { status } = await Notifications.getPermissionsAsync();
//       if (status !== "granted") {
//         const { status: newStatus } =
//           await Notifications.requestPermissionsAsync();
//         if (newStatus !== "granted") {
//           alert(
//             "Push notification permission is denied. Please enable notifications in your device settings."
//           );
//           return;
//         }
//       }

//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ??
//         Constants?.easConfig?.projectId;
//       const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
//         .data;

//       if (token && auth) {
//         await addPushTokenToUser(token);
//       }
//     };

//     if (!isFirstLaunch && auth?.token) {
//       handlePushNotifications();
//     }
//   }, [auth, isFirstLaunch]);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="onboarding/index" />
//       <Stack.Screen name="auth/login" />
//       <Stack.Screen name="auth/signup" />
//       <Stack.Screen name="(admin)" />
//       <Stack.Screen name="(classRep)" />
//       <Stack.Screen name="(student)" />
//     </Stack>
//   );
// };

import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Toast from "react-native-root-toast";
import { useEffect } from "react";
import { useAuthState } from "./auth/context";
import React from "react";
import { AppContextProvider } from "../context";
import { RootSiblingParent } from "react-native-root-siblings";
import { axiosApi } from "../components/api";

const PushNotificationHandler = () => {
  const { auth, isFirstLaunch } = useAuthState();

  useEffect(() => {
    const setupPushNotifications = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            Toast.show("Please enable notifications in your settings.", {
              backgroundColor: "red",
              textColor: "white",
            });
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
          Toast.show("Push notifications enabled!", {
            backgroundColor: "green",
            textColor: "white",
          });
        }
      } catch (error) {
        console.error("Push notification setup failed:", error);
      }
    };

    if (!isFirstLaunch && auth) {
      setupPushNotifications();
    }
  }, [auth, isFirstLaunch]);

  const addPushTokenToUser = async (pushToken: string) => {
    // setLoading(true);
    try {
      const { api } = await axiosApi();
      const res = await api.put(`/notification/save-token`, {
        pushToken,
      });
      return res?.data;
    } catch (error: any) {
      // setLoading(false);
      console.log({ error });
      const errorMessage =
        error?.response?.data?.message || error?.message || "An error occurred";
      Toast.show(errorMessage, {
        backgroundColor: "red",
        textColor: "white",
      });
      console.log({ errorMessage });
    } finally {
      // setLoading(false);
    }
  };

  return null;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color="#9C27B0"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <RootSiblingParent>
      <AppContextProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding/index" />
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/signup" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(classRep)" />
          <Stack.Screen name="(student)" />
        </Stack>
        <PushNotificationHandler />
      </AppContextProvider>
    </RootSiblingParent>
  );
}
