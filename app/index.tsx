import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

const HomeScreen = () => {
  return (
    <SafeAreaView>
      <View className={"p-8 bg-blue-800 flex justify-center h-full"}>
        <View className="mb-8">
          <Text className={"text-3xl mb-2 text-center text-white"}>
            Welcome
          </Text>
          <Text className="text-white text-center">Tell us about you</Text>
        </View>
        <View className="flex flex-row gap-16 items-center justify-center">
          <View className="flex flex-col justify-center items-center">
            <Link href={{ pathname: "auth/signup", params: { role: "admin" } }}>
              <View className="border rounded-xl p-4 border-white w-20 h-20 flex justify-center items-center">
                <Image
                  source={require("../assets/images/admin.png")}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              </View>
            </Link>
            <Text className="text-white mt-2">Admin</Text>
          </View>
          <View className="flex flex-col justify-center items-center">
            <Link
              href={{ pathname: "auth/signup", params: { role: "classRep" } }}
            >
              <View className="border rounded-xl p-4 border-white w-20 h-20 flex justify-center items-center">
                <Image
                  source={require("../assets/images/admin.png")}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              </View>
            </Link>
            <Text className="text-white mt-2">Rep</Text>
          </View>
          <View className="flex flex-col justify-center items-center">
            <Link
              href={{ pathname: "auth/signup", params: { role: "student" } }}
            >
              <View className="border rounded-xl border-white w-20 h-20 flex justify-center items-center">
                <Image
                  source={require("../assets/images/student.jpg")}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              </View>
            </Link>
            <Text className="text-white mt-2">Student</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
