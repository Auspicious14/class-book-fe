import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, View, TouchableOpacity, Image } from "react-native";
import { CustomText } from "../../components";

interface IProps {
  color: boolean;
  next: () => void;
}

const OnboardFinalScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className=" bg-secondary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <CustomText className="text-dark text-3xl text-center font-bold my-2">
          You're all set!
        </CustomText>
        <CustomText className="text-dark">
          Start booking lecture halls now and take control of your study or
          meeting space. Happy booking!
        </CustomText>
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
        <FontAwesome6 name="dot-circle" color={"gray"} />
        <FontAwesome6 name="dot-circle" color={color ? "#4CAF50" : "gray"} />
      </View>
      <TouchableOpacity
        onPress={next}
        className="bg-primary rounded-full p-4 mt-12 w-full"
      >
        <CustomText className="text-center text-white">
          Start Booking
        </CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardFinalScreen;
