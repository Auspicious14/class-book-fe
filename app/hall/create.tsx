import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Formik } from "formik";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Hall Name is required"),
  location: Yup.string().required("Locaion is required"),
});

const CreateHallScreen = () => {
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("secret");
      if (storedToken) {
        const parsed = JSON.parse(storedToken);
        setToken(parsed.token);
      }
    } catch (error) {
      console.error("Failed to fetch token", error);
    }
  };
  useEffect(() => {
    fetchToken();
  }, [token]);

  const handleSubmit = async (val: any, actions: any) => {
    const { name, location } = val;
    setLoading(true);
    try {
      const response = await axios({
        url: "http://192.168.25.241:2000/create/hall",
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

      if (data.data) {
        actions.resetForm({
          values: { name: "", location: "" },
        });
        router.push("hall/halls");
      }
    } catch (error: any) {
      Toast.show(error?.message, {
        backgroundColor: "green",
        textColor: "white",
      });
      setLoading(false);
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
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ handleBlur, handleChange, values, handleSubmit, errors }) => (
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
                onPress={() => handleSubmit()}
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
