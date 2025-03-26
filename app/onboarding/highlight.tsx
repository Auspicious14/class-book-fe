import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { CustomText } from "../../components";

interface IProps {
  next: () => void;
  color: boolean;
}

const OnboardHighlightScreen: React.FC<IProps> = ({ color, next }) => {
  return (
    <SafeAreaView className="bg-secondary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <CustomText className="text-dark text-3xl text-center font-bold my-2">
          Find the Perfect Lecture Hall
        </CustomText>
        <CustomText className="text-dark ">
          Quickly search and filter available lecture halls by size, location,
          or facilities. Stay on top of availability in real-time.
        </CustomText>
      </View>
      <View className="my-4">
        <Image
          source={require("../../assets/images/House searching-rafiki.png")}
          alt="house-searching"
          className="w-96 h-96 object-cover rounded-xl"
        />
      </View>
      <View className="flex gap-4 flex-row">
        <FontAwesome6 name="dot-circle" color={"gray"} />
        <FontAwesome6 name="dot-circle" color={color ? "#4CAF50" : "gray"} />
        <FontAwesome6 name="dot-circle" color="gray" />
        <FontAwesome6 name="dot-circle" color="gray" />
        <FontAwesome6 name="dot-circle" color="gray" />
      </View>
      <TouchableOpacity
        onPress={next}
        className="bg-primary rounded-full p-4 mt-12 w-full"
      >
        <CustomText className="text-center text-white">Next</CustomText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardHighlightScreen;
