import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Redirect, useNavigation } from "expo-router";
import { useHallState } from "../hall/context";
import { IHallQuery } from "../hall/model";
import { useProfileState } from "../profile/context";
import AvailableHalls from "./available";
import HeroCarousel from "./hero";
import { useAuthState } from "../auth/context";
import { ProtectedRoute } from "../../hooks/protectedRoute";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { getProfile, profile } = useProfileState();
  const { getHalls, halls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>({ available: true });

  useEffect(() => {
    getProfile();
    getHalls(filter);
    StatusBar.setBarStyle("light-content");
  }, [filter]);

  return (
    <ProtectedRoute>
      <View className={"px-4 bg-secondary  h-full"}>
        <View className="">
          <Text className={"text-xl my-2 text-dark "}>{`Welcome Back, ${
            profile?.firstName || "Admin"
          }!`}</Text>
        </View>

        <HeroCarousel />

        <View className="flex-row justify-between my-4">
          {profile?.role === "admin" && (
            <Link
              href="/hall/create"
              className="items-center"
              onPress={() => navigation.navigate("CreateHall")}
            >
              <Image
                source={require("../../assets/images/Hotel Booking-pana.png")}
                className="w-28 h-28 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-dark">Create a Hall</Text>
            </Link>
          )}

          <TouchableOpacity
            className="items-center"
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("../../assets/images/Profile pic-cuate.png")}
              className="w-28 h-28 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-dark">View Profile</Text>
          </TouchableOpacity>

          <Link
            href="/hall"
            className="items-center"
            // onPress={() => navigation.navigate("HallPage")}
          >
            <Image
              source={require("../../assets/images/Digital nomad-pana.png")}
              className="w-28 h-28 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-dark">Explore Halls</Text>
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
