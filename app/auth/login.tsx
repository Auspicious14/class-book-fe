import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
  password: Yup.string().required().min(6),
});

const LoginScreen = () => {
  const route = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (val: any) => {
    const { email, password } = val;

    setLoading(true);
    try {
      const response = await axios({
        url: "http://192.168.213.241:2000/auth/login",
        method: "POST",
        data: { email, password, role: route.role },
      });

      setLoading(false);

      if (response.status !== 200) {
        throw new Error("Invalid login credentials");
      }
      const data = await response.data;
      console.log(data);
      AsyncStorage.setItem("token", data.token);
      data?.data?.role == "classRep" ? router.push("booking") : "";
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView>
      <View className={"p-8"}>
        <Text className={"text-2xl mb-4 text-center"}>Login</Text>
        <ImageBackground
          source={require("../../assets/images/admin.png")}
          className="flex justify-center"
        />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <Text className="my-2">Email</Text>
              <TextInput
                className={"border p-2 mb-4 rounded-md border-gray-200"}
                placeholder="Email"
                value={values.email}
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
              />
              <View className="relative">
                <Text className="my-2">Password</Text>
                <TextInput
                  className={"border p-2 mb-4 rounded-md border-gray-200"}
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                  secureTextEntry={showPassword}
                />
                <View className="absolute top-12 right-4 ">
                  {showPassword ? (
                    <Feather
                      size={15}
                      name="eye-off"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <Feather
                      size={15}
                      name="eye"
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  )}
                </View>
              </View>
              <TouchableOpacity
                disabled={loading}
                className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-blue-800"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white ">
                  {loading ? "Loading..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
