import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useNavigation } from "expo-router";
import { useProfileState } from "./profile/context";
import { useHallState } from "./hall/context";
import { HallListItem } from "./hall/components/item";
import { AvailableHalls } from "./home/available";
import { IHallQuery } from "./hall/model";
import { HeroCarousel } from "./home/hero";

const HomeScreen = () => {
  const navigation: any = useNavigation();
  const { getProfile, profile } = useProfileState();
  const { getHalls, halls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>({ available: true });
  useEffect(() => {
    getProfile();
    getHalls(filter);
  }, [filter]);

  return (
    <SafeAreaView>
      <View className={"px-4 bg-secondary  h-full"}>
        <View className="">
          <Text
            className={"text-xl mb-2 text-primary"}
          >{`Welcome Back, ${profile.firstName}!`}</Text>
        </View>

        <HeroCarousel />
        {/* <View className="flex-row justify-between my-4">
          <TouchableOpacity
            className="bg-primary p-4 rounded-md items-center"
            onPress={() => navigation.navigate("hall/booking")}
          >
            <Image
              source={require("../assets/images/Hotel Booking-pana.png")}
              style={{ width: 40, height: 40, marginBottom: 8 }}
              resizeMode="cover"
            />
            <Text className="text-white">Book a Hall</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary p-4 rounded-md items-center"
            onPress={() => navigation.navigate("profile/page")}
          >
            <Image
              source={require("../assets/images/Profile pic-cuate.png")}
              style={{ width: 40, height: 40, marginBottom: 8 }}
              resizeMode="cover"
            />
            <Text className="text-white">View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-primary p-4 rounded-md items-center"
            onPress={() => navigation.navigate("hall/page")}
          >
            <Image
              source={require("../assets/images/Digital nomad-pana.png")}
              style={{ width: 40, height: 40, marginBottom: 8 }}
              resizeMode="cover"
            />
            <Text className="text-white">Explore Halls</Text>
          </TouchableOpacity>
        </View> */}

        <View className="flex-row justify-between my-4">
          {(profile?.role === "admin" || profile.role === "classRep") && (
            <TouchableOpacity
              className="items-center"
              onPress={() => navigation.navigate("hall/create")}
            >
              <Image
                source={require("../assets/images/Hotel Booking-pana.png")}
                className="w-28 h-28 rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-primary">Create a Hall</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="items-center"
            onPress={() => navigation.navigate("profile/page")}
          >
            <Image
              source={require("../assets/images/Profile pic-cuate.png")}
              className="w-28 h-28 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-primary">View Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => navigation.navigate("hall/page")}
          >
            <Image
              source={require("../assets/images/Digital nomad-pana.png")}
              className="w-28 h-28 rounded-xl"
              resizeMode="cover"
            />
            <Text className="text-primary">Explore Halls</Text>
          </TouchableOpacity>
        </View>

        <AvailableHalls halls={halls} loading={loading} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
