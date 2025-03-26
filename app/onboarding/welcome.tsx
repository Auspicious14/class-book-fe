import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  Button,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomText } from "../../components";

interface IProps {
  next: () => void;
  color: boolean;
}
const WelcomeScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className="bg-secondary h-full flex justify-center items-center px-10">
      <View className="my-4">
        <CustomText className="text-dark text-3xl text-center font-bold my-2">
          Welcome to Class Book
        </CustomText>
        <CustomText className="text-dark text-xs">
          Easily book lecture halls, get real-time availability updates, and
          never miss a reservation with notifications. Let's get started!
        </CustomText>
      </View>
      <View className="my-4">
        <Image
          source={require("../../assets/images/Schedule-amico.png")}
          alt="schedule-amico"
          className="w-96 h-96 object-cover rounded-xl"
        />
      </View>
      <View className="flex gap-4 flex-row">
        <FontAwesome6 name="dot-circle" color={color ? "#4CAF50" : "gray"} />
        <FontAwesome6 name="dot-circle" color="gray" />
        <FontAwesome6 name="dot-circle" color="gray" />
        <FontAwesome6 name="dot-circle" color="gray" />
        <FontAwesome6 name="dot-circle" color="gray" />
      </View>
      <TouchableOpacity
        className="bg-primary rounded-full p-4 mt-12 w-full"
        onPress={next}
      >
        <CustomText className="text-center text-white">Next</CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
