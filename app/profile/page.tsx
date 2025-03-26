import React, { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useProfileState } from "./context";
import { Divider } from "@rneui/base";
import { useAuthState } from "../auth/context";
import { CustomText } from "../../components";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = () => {
  const { profile, getProfile, loading } = useProfileState();
  const { logout } = useAuthState();

  // const avatarUrl = profile?.email
  //   ? `https://www.gravatar.com/avatar/${require("crypto")
  //       .createHash("md5")
  //       .update(profile.email.toLowerCase().trim())
  //       .digest("hex")}?s=200&d=identicon`
  //   : null;
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView>
        <LinearGradient
          colors={["#4caf50", "#6b7280"]}
          className="h-52 flex justify-center items-center"
        >
          <View className=" self-center">
            <View className="w-28 h-28 rounded-full bg-primary border-4 border-white shadow-md flex justify-center items-center overflow-hidden">
              <Text className="font-sans text-4xl text-white uppercase">
                {`${profile?.firstName?.charAt(0) || ""}${
                  profile?.lastName?.charAt(0) || ""
                }`}
              </Text>
            </View>
          </View>
          {/* <CustomText className="text-2xl text-white capitalize">
            {`${profile?.firstName || ""} ${profile?.lastName || ""}`}
          </CustomText>
          <CustomText className="text-sm text-white capitalize mt-1">
            {profile?.role || "N/A"}
          </CustomText> */}
        </LinearGradient>

        {/* Details Card */}
        <View className="bg-white rounded-t-3xl shadow-sm border border-gray-200 mx-6 pt-16 pb-6">
          <View className="px-4 space-y-4">
            <View className="flex-row justify-between items-center">
              <CustomText className="text-sm text-gray-500">
                First Name
              </CustomText>
              <CustomText className="text-base text-dark capitalize">
                {profile?.firstName || "N/A"}
              </CustomText>
            </View>
            <View className="border-b border-gray-200" />

            <View className="flex-row justify-between items-center">
              <CustomText className="text-sm text-gray-500">
                Last Name
              </CustomText>
              <CustomText className="text-base text-dark capitalize">
                {profile?.lastName || "N/A"}
              </CustomText>
            </View>
            <View className="border-b border-gray-200" />

            <View className="flex-row justify-between items-center">
              <CustomText className="text-sm text-gray-500">Email</CustomText>
              <CustomText className="text-base text-dark">
                {profile?.email || "N/A"}
              </CustomText>
            </View>
            <View className="border-b border-gray-200" />

            <View className="flex-row justify-between items-center">
              <CustomText className="text-sm text-gray-500">Role</CustomText>
              <CustomText className="text-base text-dark capitalize">
                {profile?.role || "N/A"}
              </CustomText>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            onPress={logout}
            className="mt-6 mx-4 border border-red-500 py-3 rounded-xl items-center shadow-sm"
          >
            <CustomText className="text-base text-red-500">Sign Out</CustomText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
