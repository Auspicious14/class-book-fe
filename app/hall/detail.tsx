import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { useHallState } from "./context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { screenWidth } from "../../constants/utils";
import { IHall } from "./model";
import { CustomText } from "../../components";

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
        <CustomText className="font-bold text-2xl text-dark">
          {item?.name}
        </CustomText>
        <CustomText className="text-base text-dark">
          {item?.description}
        </CustomText>
        <CustomText className="text-base text-dark">
          {item?.capacity} students
        </CustomText>
        <CustomText
          className={`text-base ${
            item?.available ? "text-primary" : "text-accent"
          }`}
        >
          {item?.available ? "Available" : "Booked"}
        </CustomText>
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
              <CustomText className="text-white font-bold">Book Now</CustomText>
            </Link>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
