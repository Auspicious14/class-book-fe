import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

interface IProps {
  color: boolean;
  next: () => void;
}

const OnboardFinalScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className=" bg-primary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <Text className="text-white text-3xl text-center font-bold my-2">
          You're all set!
        </Text>
        <Text className="text-white ">
          Start booking lecture halls now and take control of your study or
          meeting space. Happy booking!
        </Text>
      </View>
      <View className="my-4">
        <Image
          source={require("../../assets/images/Checklist-pana.png")}
          alt="checklist"
          className="w-96 h-96 object-cover rounded-xl"
        />
      </View>
      <View className="flex gap-4 flex-row">
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={color ? "#9C27B0" : "white"} />
      </View>
      <TouchableOpacity
        onPress={next}
        className="bg-accent rounded-full p-4 mt-12 w-full"
      >
        <Text className="text-center text-white">Start Booking</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardFinalScreen;
