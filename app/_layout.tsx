// import React, { useState, useEffect } from "react";
// import {
//   DefaultTheme,
//   ThemeProvider,
//   useNavigation,
// } from "@react-navigation/native";
// import * as SplashScreen from "expo-splash-screen";
// import "react-native-reanimated";
// import { useFonts } from "expo-font";
// import { RootSiblingParent } from "react-native-root-siblings";
// import { Ionicons } from "@expo/vector-icons";
// import { Stack } from "expo-router/stack";
// import { fetchToken } from "../helper";
// import { AppContextProvider } from "../context";
// import { TouchableOpacity, Platform, ActivityIndicator } from "react-native";
// import * as Notifications from "expo-notifications";
// import { useHomeState } from "./home/context";
// import * as Linking from "expo-linking";
// import Constants from "expo-constants";

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const router: any = useNavigation();
//   const { addPushTokenToUser } = useHomeState();
//   const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null); // Initially null, so we know it's not yet decided
//   const [pushToken, setPushToken] = useState<string | null>(null);
//   const [auth, setAuth] = useState<{ token: string; role: string } | null>(
//     null
//   ); // Initially null to indicate loading
//   const [loading, setLoading] = useState(true);

//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/FiraCode-Regular.ttf"),
//   });

//   useEffect(() => {
//     const initializeApp = async () => {
//       try {
//         const authStatus = await fetchToken();

//         if (!authStatus || !authStatus.token) {
//           setIsFirstLaunch(true); // This will trigger conditional render
//           router.push("/onboarding/index");
//         } else if (authStatus.onboardingIncomplete) {
//           router.push("/onboarding/index");
//           setIsFirstLaunch(true); // Same here
//         } else {
//           setAuth({ token: authStatus.token, role: authStatus.role });
//           setIsFirstLaunch(false); // App will behave as normal
//         }

//         const { status } = await Notifications.getPermissionsAsync();
//         if (status !== "granted") {
//           const { status: newStatus } =
//             await Notifications.requestPermissionsAsync();
//           if (newStatus !== "granted") {
//             alert(
//               "Push notification permission is denied. Please enable notifications in your device settings."
//             );
//             return;
//           }
//         }
//         const projectId =
//           Constants?.expoConfig?.extra?.eas?.projectId ??
//           Constants?.easConfig?.projectId;
//         console.log(projectId, "projectIddd");
//         const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
//           .data;
//         setPushToken(token);
//         addPushTokenToUser(authStatus?.token, token);
//       } catch (error) {
//         console.error("Error initializing app:", error);
//       } finally {
//         setLoading(false);
//         SplashScreen.hideAsync();
//       }
//     };

//     initializeApp();
//   }, []);

//   if (!loaded) {
//     return null;
//   }
//   console.log({ loading, isFirstLaunch, auth });

//   if (loading) {
//     return <ActivityIndicator size="large" />;
//   }

//   // if (isFirstLaunch) {
//   //   // If this is the first launch (user is not authenticated yet or needs to complete onboarding)
//   //   return (
//   //     <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
//   //   );
//   // }

//   if (auth && auth.token) {
//     // If the user is authenticated, show the main app
//     return (
//       <Stack.Screen name="(tabs)/_layout" options={{ headerShown: false }} />
//     );
//   }

//   const openAppSettings = () => {
//     Linking.openSettings(); // This opens the app settings for both iOS and Android
//   };

//   return (
//     <AppContextProvider>
//       <RootSiblingParent>
//         <ThemeProvider value={DefaultTheme}>
//           <Stack
//             screenOptions={{
//               headerShown: true,
//               statusBarColor: "#4CAF50",
//               statusBarStyle: "auto",
//               title: "",
//               headerStyle: {
//                 backgroundColor: "#4CAF50",
//               },

//               headerRight: () => (
//                 <TouchableOpacity
//                   onPress={() => router.navigate("profile/page")}
//                   className="mx-4"
//                 >
//                   <Ionicons
//                     name="person-circle"
//                     size={30}
//                     color={"white"}
//                     className="text-white"
//                   />
//                 </TouchableOpacity>
//               ),
//             }}
//           >
//             {isFirstLaunch ? (
//               <>
//                 <Stack.Screen
//                   name="onboarding/index"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="auth/signup"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="auth/login"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen name="hall/page" />
//                 <Stack.Screen name="hall/detail" />
//                 <Stack.Screen name="hall/create" />
//                 <Stack.Screen name="hall/booking" />
//                 <Stack.Screen name="+not-found" />
//               </>
//             ) : auth!.token && auth!.role === "admin" ? (
//               <>
//                 <Stack.Screen
//                   name="(tabs)/_layout"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen name="hall/page" />
//                 <Stack.Screen name="hall/detail" />
//                 <Stack.Screen name="hall/create" />
//                 <Stack.Screen name="profile/page" />
//                 <Stack.Screen name="hall/booking" />
//                 <Stack.Screen name="+not-found" />
//               </>
//             ) : auth!.token && auth!.role === "classRep" ? (
//               <>
//                 <Stack.Screen
//                   name="(tabs)/_layout"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen name="hall/page" />
//                 <Stack.Screen name="hall/booking" />
//                 <Stack.Screen name="profile/page" />
//                 <Stack.Screen name="+not-found" />
//               </>
//             ) : auth!.token && auth!.role === "student" ? (
//               <>
//                 <Stack.Screen
//                   name="(tabs)/_layout"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen name="hall/page" />
//                 <Stack.Screen name="hall/detail" />
//                 <Stack.Screen name="profile/page" />
//               </>
//             ) : (
//               <>
//                 <Stack.Screen
//                   name="auth/login"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="auth/signup"
//                   options={{ headerShown: false }}
//                 />
//                 <Stack.Screen
//                   name="+not-found"
//                   options={{ headerShown: false }}
//                 />
//               </>
//             )}
//           </Stack>
//         </ThemeProvider>
//       </RootSiblingParent>
//     </AppContextProvider>
//   );
// }

import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, StatusBar, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchToken } from "../helper";
import { AppContextProvider } from "../context";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import LoginScreen from "./auth/login";
import SignUpScreen from "./auth/signup";
import OnboardScreen from "./onboarding";
import HallsScreen from "./hall/page";
import CreateHallScreen from "./hall/create";
import ProfileScreen from "./profile/page";
import BookingScreen from "./hall/booking";
import HomeScreen from "./home/page";
import { HallDetailScreen } from "./hall/detail";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

interface IAuthProps {
  token: string;
  role: "admin" | "student" | "classRep";
}

export default function App() {
  const [auth, setAuth] = useState<IAuthProps>();
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [loading, setLoading] = useState(true);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/FiraCode-Regular.ttf"),
  });
  useEffect(() => {
    const initializeApp = async () => {
      const authStatus = await fetchToken();
      if (!authStatus || !authStatus.token) {
        setIsFirstLaunch(true);
      } else {
        setAuth({ token: authStatus.token, role: authStatus.role });
        setIsFirstLaunch(false);
      }

      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }

      if (loaded) {
        SplashScreen.hideAsync();
      }
      setLoading(false);
    };

    initializeApp();
  }, [loaded]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" />;
  }
  return (
    <AppContextProvider>
      <NavigationContainer independent={true}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        {isFirstLaunch ? <OnboardingStack /> : <MainAppStack auth={auth} />}
      </NavigationContainer>
    </AppContextProvider>
  );
}

const OnboardingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardScreen} />
      <Stack.Screen name="Signup" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="HallPage" component={HallsScreen} /> */}
    </Stack.Navigator>
  );
};

const MainAppStack = ({ auth }: { auth?: IAuthProps }) => {
  if (!auth) {
    return null;
  }
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {auth.token ? (
          <>
            {auth.role === "admin" && (
              <>
                <Stack.Screen name="AdminTabs" component={AdminTabs} />
                <Stack.Screen name="BookHall" component={BookingScreen} />
              </>
            )}
            {auth.role === "classRep" && (
              <Stack.Screen name="ClassRepTabs" component={ClassRepTabs} />
            )}
            {auth.role === "student" && (
              <>
                <Stack.Screen name="StudentTabs" component={StudentTabs} />
                <Stack.Screen name="HallDetail" component={HallDetailScreen} />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

const AdminTabs = () => {
  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="home" size={24} color={"#4CAF50"} />
            ),
          }}
        />
        <Tab.Screen
          name="HallPage"
          component={HallsScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="list" size={24} color={"#4CAF50"} />
            ),
          }}
        />
        <Tab.Screen
          name="CreateHall"
          component={CreateHallScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="add-circle" size={24} color={"#4CAF50"} />
            ),
          }}
        />
        {/* <Tab.Screen
          name="BookHall"
          component={BookingScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="book" size={24} color={"#4CAF50"} />
            ),
          }}
        /> */}
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <Ionicons name="person" size={24} color={"#4CAF50"} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

const ClassRepTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HallPage"
        component={HallsScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="home" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tab.Screen
        name="BookHall"
        component={BookingScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="book" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color={"#4CAF50"} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StudentTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HallPage"
        component={HallsScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="home" size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => <Ionicons name="person" size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};
