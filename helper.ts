import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// export const fetchToken = async () => {
//   try {
//     const storedToken = await AsyncStorage.getItem("secret");
//     const tokenExpiry = await AsyncStorage.getItem("tokenExpiry");
//     const currentTime = new Date().getTime();
//     const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");

//     if (!storedToken) {
//       return { loggedOut: true };
//     }

//     if (storedToken) {
//       const parsed = JSON.parse(storedToken);

//       // Check if token is expired
//       if (currentTime > parseInt(tokenExpiry as string)) {
//         await AsyncStorage.removeItem("secret");
//         await AsyncStorage.removeItem("tokenExpiry");
//         return null;
//       }

//       // Check if onboarding is complete
//       if (!onboardingComplete) {
//         return { onboardingIncomplete: true };
//       }
//       console.log({ onboardingComplete });
//       return { token: parsed.token, role: parsed.role };
//     }

//     return null;
//   } catch (error) {
//     console.error("Failed to fetch token", error);
//     return null;
//   }
// };

export const fetchToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("secret");
    const tokenExpiry = await AsyncStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();
    const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");

    if (!onboardingComplete) {
      return { onboardingIncomplete: true };
    }

    if (!storedToken) {
      return { loggedOut: true };
    }

    if (currentTime > parseInt(tokenExpiry as string)) {
      await AsyncStorage.removeItem("secret");
      await AsyncStorage.removeItem("tokenExpiry");
      return { loggedOut: true };
    }

    const parsed = JSON.parse(storedToken);
    return { token: parsed.token, role: parsed.role };
  } catch (error) {
    console.error("Failed to fetch token", error);
    return { loggedOut: true };
  }
};

export const isOnboardingComplete = async () => {
  try {
    const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");
    return !!onboardingComplete;
  } catch (error) {
    console.error("Failed to check onboarding status", error);
    return false;
  }
};

export const completeOnboarding = async () => {
  try {
    await AsyncStorage.setItem("onboardingComplete", "true");
    // router.navigate("Home");
  } catch (error) {
    console.error("Error saving onboarding completion", error);
  }
};
