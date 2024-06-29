import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-root-toast";

const CreateHallScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const token = AsyncStorage.getItem("token");

  console.log(
    token.then((e) => console.log(e, "eeeee")),
    "token"
  );

  const handleSubmit = async (val: any) => {
    const { name, location } = val;
    setLoading(true);
    try {
      const response = await axios({
        url: "http://192.168.213.241:2000/create/hall",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { name, location },
      });

      setLoading(false);

      const data = await response.data;

      if (data.message) {
        Toast.show(data?.message, {
          backgroundColor: "green",
          textColor: "white",
        });
      }
    } catch (error: any) {
      console.log("Error", error.message);
    }
  };

  return (
    <SafeAreaView>
      <View className="p-8 h-full">
        <Text className="text-center my-4 text-xl font-bold">
          Create a Lecture Hall
        </Text>
        <Formik
          initialValues={{ name: "", location: "" }}
          validationSchema={""}
          onSubmit={handleSubmit}
        >
          {({ handleBlur, handleChange, values, errors }) => (
            <View>
              <Text className="my-2">Name</Text>
              <TextInput
                className={"border p-2 mb-4 rounded-md border-gray-200"}
                placeholder="Name"
                value={values.name}
                onBlur={handleBlur("name")}
                onChangeText={handleChange("name")}
              />
              <Text className="text-red-500">{errors.name}</Text>
              <Text className="">Location</Text>
              <TextInput
                className={"border p-2 mb-4 rounded-md border-gray-200"}
                placeholder="Location"
                value={values.location}
                onBlur={handleBlur("location")}
                onChangeText={handleChange("location")}
              />
              <Text className="text-red-500">{errors.location}</Text>

              <TouchableOpacity
                disabled={loading}
                className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-blue-800"
                onPress={handleSubmit}
              >
                <Text className="text-white ">
                  {loading ? "Loading..." : "Create Hall"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default CreateHallScreen;
