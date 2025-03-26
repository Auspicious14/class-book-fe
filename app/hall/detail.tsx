import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { CustomText } from "../../components"; // Adjust path
import { IHall } from "./model";
import { screenWidth } from "../../constants/utils";
import { fetchToken } from "../../helper";

export default function HallDetailScreen() {
  const { hallData } = useLocalSearchParams();
  const item: IHall = hallData ? JSON.parse(hallData as string) : null;
  const [role, setRole] = useState<string>("");

  const getRole = async () => {
    const role = await fetchToken();
    setRole(role?.role);
    return role;
  };

  useEffect(() => {
    getRole();
  }, []);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-secondary">
        <CustomText className="text-dark text-lg">Hall not found</CustomText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView>
        <View className="w-full h-80">
          <Image
            source={{
              uri: item?.images[0]?.uri || "https://via.placeholder.com/400",
            }}
            className="w-full h-full object-cover"
          />
        </View>

        <View className="bg-white rounded-t-3xl shadow-sm mx-6 -mt-12 p-6">
          <View className="flex-row justify-between items-center mb-4">
            <CustomText className="text-dark text-2xl font-bold capitalize flex-1">
              {item?.name}
            </CustomText>
            <CustomText
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                item?.available
                  ? "bg-primary text-white"
                  : "bg-accent text-white"
              }`}
            >
              {item?.available ? "Available" : "Booked"}
            </CustomText>
          </View>

          {/* Description */}
          <CustomText className="text-dark text-base mb-4">
            {item?.description || "No description available."}
          </CustomText>

          {/* Details Section */}
          <View className="space-y-3">
            <View className="flex-row justify-between items-center">
              <CustomText className="text-gray-500 text-sm font-semibold w-24">
                Capacity
              </CustomText>
              <CustomText className="text-dark text-base">
                {item?.capacity} students
              </CustomText>
            </View>
            <View className="border-b border-gray-200" />

            {/* Add more details if available, e.g., location */}
            {/* <View className="flex-row items-center">
              <CustomText className="text-gray-500 text-sm font-semibold w-24">
                Location
              </CustomText>
              <CustomText className="text-dark text-base">
                {item?.location || "N/A"}
              </CustomText>
            </View>
            <View className="border-b border-gray-200" /> */}
          </View>

          {/* Book Now Button */}
          {role !== "student" && (
            <>
              {item?.available && (
                <TouchableOpacity className="bg-primary py-3 rounded-xl mt-6 flex justify-center items-center shadow-sm">
                  <Link
                    href={{
                      pathname: "/hall/booking",
                      params: { item: JSON.stringify(item) } as Record<
                        string,
                        string
                      >,
                    }}
                    asChild
                  >
                    <CustomText className="text-white text-base font-semibold">
                      Book Now
                    </CustomText>
                  </Link>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Additional Info (Optional) */}
        {/* Uncomment if you have more data like amenities or images */}
        {/* <View className="mx-6 mt-6">
          <CustomText className="text-dark text-lg font-semibold mb-2">
            Amenities
          </CustomText>
          <View className="flex-row flex-wrap gap-2">
            {item?.amenities?.map((amenity, index) => (
              <CustomText
                key={index}
                className="bg-gray-100 text-dark text-sm px-3 py-1 rounded-full"
              >
                {amenity}
              </CustomText>
            ))}
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
