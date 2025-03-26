import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useNavigation } from "expo-router";
import { useHallState } from "../hall/context";
import { IHallQuery } from "../hall/model";
import { useProfileState } from "../profile/context";
import AvailableHalls from "./available";
import HeroCarousel from "./hero";
import { useAuthState } from "../auth/context";
import { ProtectedRoute } from "../../hooks/protectedRoute";
import { CustomText } from "../../components";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { getProfile, profile } = useProfileState();
  const { getHalls, halls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>({ available: true });

  useEffect(() => {
    getProfile();
    getHalls(filter);
    StatusBar.setBarStyle("default");
  }, [filter]);

  return (
    <ProtectedRoute>
      <View className="px-4 bg-secondary h-full">
        <View className="my-4">
          <CustomText className="text-xl text-dark font-bold">
            {`Welcome Back, ${profile?.firstName || "Admin"}!`}
          </CustomText>
        </View>

        <HeroCarousel />

        <View className="flex-row justify-between my-6 gap-4">
          {profile?.role === "admin" && (
            <Link href="/hall/create" asChild>
              <TouchableOpacity className="flex-1 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <Image
                  source={require("../../assets/images/Hotel Booking-pana.png")}
                  className="w-24 h-24 rounded-lg"
                  resizeMode="cover"
                />
                <CustomText className="text-dark font-semibold mt-2">
                  Create a Hall
                </CustomText>
              </TouchableOpacity>
            </Link>
          )}

          <Link href="/profile" asChild>
            <TouchableOpacity className="flex-1 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-200">
              <Image
                source={require("../../assets/images/Profile pic-cuate.png")}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <CustomText className="text-dark font-semibold mt-2">
                View Profile
              </CustomText>
            </TouchableOpacity>
          </Link>

          <Link href="/hall" asChild>
            <TouchableOpacity className="flex-1 items-center bg-white rounded-xl p-3 shadow-sm border border-gray-200">
              <Image
                source={require("../../assets/images/Digital nomad-pana.png")}
                className="w-24 h-24 rounded-lg"
                resizeMode="cover"
              />
              <CustomText className="text-dark font-semibold mt-2">
                Explore Halls
              </CustomText>
            </TouchableOpacity>
          </Link>
        </View>

        <AvailableHalls
          halls={halls?.filter((h) => h.available)}
          loading={loading}
        />
      </View>
    </ProtectedRoute>
  );
};

export default HomeScreen;
