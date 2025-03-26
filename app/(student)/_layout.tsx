import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#9C27B0",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Ionicons name="home" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tabs.Screen
        name="hall"
        options={{
          headerShown: false,
          tabBarLabel: "Halls",
          tabBarIcon: () => (
            <Ionicons name="list" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color={"#4CAF50"} />
          ),
        }}
      />
    </Tabs>
  );
}
