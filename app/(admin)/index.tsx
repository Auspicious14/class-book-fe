import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../home/page";

export default function AdminHome() {
  return (
    <SafeAreaView className="flex-1">
      <View className="px-4 py-6">
        <HomeScreen />
      </View>
    </SafeAreaView>
  );
}
