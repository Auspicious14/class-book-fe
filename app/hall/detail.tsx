import { useLocalSearchParams, useRouter } from "expo-router";
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

export const HallDetailScreen = () => {
  const route = useRoute();
  const navigation: any = useNavigation();
  const item = route.params;
  const { hall, loading, getOneHall } = useHallState();

  const { _id = "" }: any = item;
  console.log(item, "itemmm");

  useEffect(() => {
    getOneHall(_id);
  }, []);

  if (loading) {
    <ActivityIndicator size={"large"} />;
  }

  return (
    <SafeAreaView className="px-4">
      <View>
        <Image source={{ uri: hall?.images[0].uri, width: 200, height: 200 }} />
      </View>
      <View>
        <Text className="font-bold text-xl">{hall?.name}</Text>
        <Text className="text-lg">{hall?.description}</Text>
        <Text className="text-lg">{hall?.capacity}</Text>
        <Text
          className={`text-lg ${
            hall?.available ? "text-primary" : "text-accent"
          }`}
        >
          {hall?.available ? "Available" : "Booked"}
        </Text>
        <View className="p-3">
          {hall?.available && (
            <TouchableOpacity
              className="bg-primary py-2 rounded-md items-center"
              onPress={() => navigation.navigate("BookHall", { item: hall })}
            >
              <Text className="text-white font-bold">Book Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
