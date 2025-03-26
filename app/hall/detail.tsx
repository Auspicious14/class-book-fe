import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useHallState } from "./context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { screenWidth } from "../../constants/utils";
import { IHall } from "./model";

export const HallDetailScreen = () => {
  const { hallData } = useLocalSearchParams();
  const item: IHall = hallData ? JSON.parse(hallData as string) : null;

  return (
    <SafeAreaView className="px-4 ">
      <View className="w-full  ">
        <Image
          source={{
            uri: item?.images[0]?.uri,
            width: screenWidth,
            height: 400,
          }}
          className="object-cover w-full h-auto"
        />
      </View>
      <View className="my-8 relative">
        <Text className="font-bold text-2xl text-dark">{item?.name}</Text>
        <Text className="text-base text-dark">{item?.description}</Text>
        <Text className="text-base text-dark">{item?.capacity} students</Text>
        <Text
          className={`text-base ${
            item?.available ? "text-primary" : "text-accent"
          }`}
        >
          {item?.available ? "Available" : "Booked"}
        </Text>
        <View className="p-3">
          {item?.available && (
            <Link
              href={{
                pathname: "/hall/booking",
                params: {
                  item: JSON.stringify(item),
                } as Record<string, string>,
              }}
              asChild
              className="bg-primary py-2 rounded-md items-center"
            >
              <Text className="text-white font-bold">Book Now</Text>
            </Link>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
