import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const fetchToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem("secret");
    const tokenExpiry = await AsyncStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();
    const onboardingComplete = await AsyncStorage.getItem("onboardingComplete");

    if (storedToken) {
      const parsed = JSON.parse(storedToken);
      if (currentTime > parseInt(tokenExpiry as string)) {
        await AsyncStorage.removeItem("secret");
        await AsyncStorage.removeItem("tokenExpiry");
        return null;
      }
      return { token: parsed.token, role: parsed.role };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch token", error);
    return null;
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
