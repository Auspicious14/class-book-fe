import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useProfileState } from "./context";
import { Divider } from "@rneui/base";

const ProfileScreen = () => {
  const { profile, getProfile, loading } = useProfileState();
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    getProfile();
    // StatusBar.setBarStyle("light-content");
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#9C27B0"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <SafeAreaView className="bg-secondary px-4">
      <View className="flex justify-center items-center text-center w-28 h-28 m-auto mt-12 rounded-full bg-primary">
        <Text className="font-bold text-2xl uppercase text-white">{`${profile?.firstName?.charAt(
          0
        )}${profile?.lastName?.charAt(0)}`}</Text>
      </View>
      <Text className="font-bold text-xl capitalize my-4 text-dark text-center">{`${profile?.firstName} ${profile?.lastName}`}</Text>

      <View className="mt-8">
        <Text className="my-2 font-bold text-lg text-dark capitalize">
          {profile.firstName}
        </Text>
        <Divider />
        <Text className="my-2 font-bold text-lg text-dark capitalize">
          {profile.lastName}
        </Text>
        <Divider />
        <Text className="my-2 font-bold text-lg text-dark">
          {profile.email}
        </Text>
        <Divider />
        <Text className="my-2 font-bold text-lg text-dark capitalize">
          {profile.role}
        </Text>
        <Divider />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
