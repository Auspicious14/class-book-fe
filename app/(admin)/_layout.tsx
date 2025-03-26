import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#9C27B0",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Dashboard",
          tabBarHideOnKeyboard: true,
          tabBarAllowFontScaling: true,
          tabBarIcon: () => (
            <Ionicons name="home" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tabs.Screen
        name="hall"
        options={{
          headerShown: false,
          headerTitle: "Halls",
          tabBarIcon: () => (
            <Ionicons name="list" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        initialParams={{ item: {} }}
        options={{
          headerShown: false,
          headerTitle: "Create",
          tabBarIcon: () => (
            <Ionicons name="add-circle" size={24} color={"#4CAF50"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          headerTitle: "Profile",
          tabBarIcon: () => (
            <Ionicons name="person" size={24} color={"#4CAF50"} />
          ),
        }}
      />
    </Tabs>
  );
}
