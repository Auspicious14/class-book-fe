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

const OnboardBookScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className=" bg-primary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <Text className="text-white text-3xl text-center font-bold my-2">
          Never Miss a Booking
        </Text>
        <Text className="text-white ">
          Receive notifications when a hall becomes available, when your booking
          starts, and when your time is almost up
        </Text>
      </View>
      <View className="my-4">
        <Image
          source={require("../../assets/images/Push notifications-bro.png")}
          alt="notification"
          className="w-96 h-96 object-cover rounded-xl"
        />
      </View>
      <View className="flex gap-4 flex-row">
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={"white"} />
        <FontAwesome6 name="dot-circle" color={color ? "#9C27B0" : "white"} />
        <FontAwesome6 name="dot-circle" color="white" />
        <FontAwesome6 name="dot-circle" color="white" />
      </View>
      <TouchableOpacity
        onPress={next}
        className="bg-accent rounded-full p-4 mt-12 w-full"
      >
        <Text className="text-center text-white">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardBookScreen;
