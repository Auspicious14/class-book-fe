import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClassRepHome() {
  return (
    <SafeAreaView>
      <View className="px-4 bg-secondary h-full">
        <Text className="text-xl my-2 text-dark">Class Rep Dashboard</Text>
        {/* Add your class rep-specific content here */}
      </View>
    </SafeAreaView>
  );
}