import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const HallDetailScreen = () => {
  const router = useRouter();
  const hall = useLocalSearchParams();

  const {
    _id = "",
    images = [],
    location = "",
    name = "",
    description = "",
    capacity = "",
    available = false,
  } = hall;
  const parsedImages = JSON.parse(images as any);

  return (
    <SafeAreaView className="px-4">
      <View>
        <Image source={{ uri: parsedImages[0].uri, width: 200, height: 200 }} />
      </View>
      <View>
        <Text className="font-bold text-xl">{name}</Text>
        <Text className="text-lg">{description}</Text>
        <Text className="text-lg">{capacity}</Text>
        <Text
          className={`text-lg ${available ? "text-primary" : "text-accent"}`}
        >
          {available ? "Available" : "Booked"}
        </Text>
        <View className="p-3">
          {available && (
            <TouchableOpacity
              className="bg-primary py-2 rounded-md items-center"
              onPress={() =>
                router.push({
                  pathname: "hall/booking",
                  params: {
                    _id,
                    name,
                  },
                })
              }
            >
              <Text className="text-white font-bold">Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
