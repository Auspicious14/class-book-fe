import React from "react";
import {
  Button,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const WelcomeScreen = () => {
  return (
    <SafeAreaView className=" font-sans bg-primary h-full flex justify-center items-center  px-10">
      <View className="my-4">
        <Text className="text-white text-3xl font-bold my-2">
          Welcome to Class Book
        </Text>
        <Text className="text-white ">
          Easily book lecture halls, get real-time availability updates, and
          never miss a reservation with notifications. Let’s get started!
        </Text>
      </View>
      <Image
        source={require("../../assets/images/Schedule-amico.png")}
        className="w-96 h-96 object-cover rounded-xl"
      />
      <TouchableOpacity className="bg-accent rounded-full p-4 w-full">
        <Text className="text-center text-white">Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
