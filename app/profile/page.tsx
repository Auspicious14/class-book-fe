import React, { useEffect } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfileState } from "./context";
import { Divider } from "@rneui/base";
import { useAuthState } from "../auth/context";
import { CustomText } from "../../components";

const ProfileScreen = () => {
  const { profile, getProfile, loading } = useProfileState();
  const { logout } = useAuthState();

  useEffect(() => {
    getProfile();
  }, []);

  // if (loading) {
  //   return (
  //     <ActivityIndicator
  //       size="large"
  //       color="#9C27B0"
  //       style={{ flex: 1, justifyContent: "center" }}
  //     />
  //   );
  // }

  return (
    // <SafeAreaView className="flex-1 bg-secondary">
    //   <ScrollView className="px-6 py-4">
    //     {/* Avatar and Name */}
    //     <View className="items-center mt-12">
    //       <View className="w-28 h-28 rounded-full bg-primary flex justify-center items-center shadow-sm">
    //         <CustomText className="font-bold text-3xl uppercase text-white">
    //           {`${profile?.firstName?.charAt(0) || ""}${
    //             profile?.lastName?.charAt(0) || ""
    //           }`}
    //         </CustomText>
    //       </View>
    //       <CustomText className="font-bold text-xl capitalize text-dark mt-4">
    //         {`${profile?.firstName || ""} ${profile?.lastName || ""}`}
    //       </CustomText>
    //     </View>

    //     {/* Profile Details */}
    //     <View className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
    //       <View className="space-y-4">
    //         <View>
    //           <CustomText className="text-dark font-semibold text-sm">
    //             First Name
    //           </CustomText>
    //           <CustomText className="text-dark text-lg capitalize mt-1">
    //             {profile?.firstName || "N/A"}
    //           </CustomText>
    //         </View>
    //         <View className="border-b border-gray-200" />

    //         <View>
    //           <CustomText className="text-dark font-semibold text-sm">Last Name</CustomText>
    //           <CustomText className="text-dark text-lg capitalize mt-1">
    //             {profile?.lastName || "N/A"}
    //           </CustomText>
    //         </View>
    //         <View className="border-b border-gray-200" />

    //         <View>
    //           <CustomText className="text-dark font-semibold text-sm">Email</CustomText>
    //           <CustomText className="text-dark text-lg mt-1">
    //             {profile?.email || "N/A"}
    //           </CustomText>
    //         </View>
    //         <View className="border-b border-gray-200" />

    //         <View>
    //           <CustomText className="text-dark font-semibold text-sm">Role</CustomText>
    //           <CustomText className="text-dark text-lg capitalize mt-1">
    //             {profile?.role || "N/A"}
    //           </CustomText>
    //         </View>
    //       </View>

    //       {/* Sign Out Button */}
    //       <TouchableOpacity
    //         onPress={logout}
    //         className="mt-6 bg-red-500 py-3 rounded-xl items-center"
    //       >
    //         <CustomText className="text-white font-semibold">Sign Out</CustomText>
    //       </TouchableOpacity>
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView className="px-6 py-4">
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 items-center mt-8">
          <View className="w-32 h-32 rounded-full bg-primary flex justify-center items-center shadow-md">
            <CustomText className="font-bold text-4xl uppercase text-white font-space-mono">
              {`${profile?.firstName?.charAt(0) || ""}${
                profile?.lastName?.charAt(0) || ""
              }`}
            </CustomText>
          </View>
          <CustomText
            className="font-bold text-2xl capitalize text-dark mt-4 font-space-mono"
          >
            {`${profile?.firstName || ""} ${profile?.lastName || ""}`}
          </CustomText>
          <CustomText className="text-gray-500 text-sm capitalize mt-1 font-space-mono">
            {profile?.role || "N/A"}
          </CustomText>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <CustomText className="text-gray-500 text-sm font-semibold font-space-mono">
                First Name
              </CustomText>
              <CustomText className="text-dark text-base capitalize font-space-mono">
                {profile?.firstName || "N/A"}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText className="text-gray-500 text-sm font-semibold font-space-mono">
                Last Name
              </CustomText>
              <CustomText className="text-dark text-base capitalize">
                {profile?.lastName || "N/A"}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText className="text-gray-500 text-sm font-semibold">Email</CustomText>
              <CustomText className="text-dark text-base">
                {profile?.email || "N/A"}
              </CustomText>
            </View>
            <View className="flex-row justify-between">
              <CustomText className="text-gray-500 text-sm font-semibold">Role</CustomText>
              <CustomText className="text-dark text-base capitalize">
                {profile?.role || "N/A"}
              </CustomText>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={logout}
          className="mt-8 border border-red-500 py-3 rounded-xl items-center"
        >
          <CustomText className="text-red-500 font-semibold text-base">Sign Out</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
