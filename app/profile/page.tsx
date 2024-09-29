import React, { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { useProfileState } from "./context";

const ProfileScreen = () => {
  const { profile, getProfile, loading } = useProfileState();

  useEffect(() => {
    getProfile();
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
    <SafeAreaView className="bg-secondary">
      <View className="flex justify-center items-center text-center w-28 h-28 m-auto my-12 rounded-full bg-primary">
        <Text className="font-bold text-2xl uppercase text-white">{`${profile?.firstName?.charAt(
          0
        )}${profile?.lastName?.charAt(0)}`}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
