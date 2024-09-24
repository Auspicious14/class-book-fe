import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IProps {
  next: () => void;
  color: boolean;
}
const WelcomeScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className="bg-secondary h-full flex justify-center items-center px-10">
      <View className="my-4">
        <Text className="text-dark text-3xl text-center font-bold my-2">
          Welcome to Class Book
        </Text>
        <Text className="text-dark text-xs">
          Easily book lecture halls, get real-time availability updates, and
          never miss a reservation with notifications. Let's get started!
        </Text>
      </View>
      <View className="my-4">
        <Image
          source={require("../../assets/images/Schedule-amico.png")}
          alt="schedule-amico"
          className="w-96 h-96 object-cover rounded-xl"
        />
      </View>
      <View className="flex gap-4 flex-row">
        <FontAwesome6 name="dot-circle" color={color ? "#9C27B0" : "white"} />
        <FontAwesome6 name="dot-circle" color="white" />
        <FontAwesome6 name="dot-circle" color="white" />
        <FontAwesome6 name="dot-circle" color="white" />
        <FontAwesome6 name="dot-circle" color="white" />
      </View>
      <TouchableOpacity
        className="bg-primary rounded-full p-4 mt-12 w-full"
        onPress={next}
      >
        <Text className="text-center text-white">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
