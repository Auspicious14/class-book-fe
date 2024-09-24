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

const OnboardManageScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className=" bg-secondary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <Text className="text-dark text-3xl text-center font-bold my-2">
          Manage and Modify Bookings
        </Text>
        <Text className="text-dark ">
          View upcoming bookings, modify reservations, or cancel anytime—all
          from one convenient dashboard.
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
        <FontAwesome6 name="dot-circle" color={"gray"} />
        <FontAwesome6 name="dot-circle" color={"gray"} />
        <FontAwesome6 name="dot-circle" color={"gray"} />
        <FontAwesome6 name="dot-circle" color={color ? "#4CAF50" : "gray"} />
        <FontAwesome6 name="dot-circle" color="gray" />
      </View>
      <TouchableOpacity
        onPress={next}
        className="bg-primary rounded-full p-4 mt-12 w-full"
      >
        <Text className="text-center text-white">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardManageScreen;
