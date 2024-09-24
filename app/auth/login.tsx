import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import Toast from "react-native-root-toast";
import { useNavigation } from "@react-navigation/native";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
  password: Yup.string().required().min(6),
});

const LoginScreen = () => {
  const navigation: any = useNavigation();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const handleSubmit = async (val: any) => {
    const { email, password } = val;

    setLoading(true);
    try {
      const response = await axios({
        url: "https://class-book-be.onrender.com/auth/login",
        method: "POST",
        data: { email, password },
      });

      setLoading(false);

      const data = await response.data;

      if (data.message) {
        Toast.show(data?.message, {
          backgroundColor: "green",
          textColor: "white",
        });
      }
      if (data.token) {
        await AsyncStorage.setItem(
          "secret",
          JSON.stringify({
            token: data.token,
            role: data?.data?.role,
          })
        );
        console.log(data.data, "data data");
        data?.data?.role === "classRep"
          ? navigation.navigate("bookHall")
          : data?.data?.role === "admin"
          ? navigation.navigate("createHall")
          : navigation.navigate("profile");
      }
    } catch (error: any) {
      setLoading(false);
      Toast.show(error?.message, {
        backgroundColor: "red",
        textColor: "white",
      });
      Alert.alert("Error", error.message);
    }
  };
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView
      style={{ height: windowHeight }}
      className={"bg-secondary p-8"}
    >
      <View>
        <View className={"flex justify-center items-center "}>
          <Image
            source={require("../../assets/images/Key-pana.png")}
            className="flex justify-center w-40 h-40 object-cover"
          />
          <Text className={"text-2xl mb-4 text-center text-dark"}>Login</Text>
        </View>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <Text className="my-2">Email</Text>
              <TextInput
                className={"border p-2 rounded-md border-gray-200"}
                placeholder="Email"
                value={values.email}
                onBlur={handleBlur("email")}
                onChangeText={handleChange("email")}
              />
              <Text className="text-red-500">{errors.email}</Text>
              <View className="relative">
                <Text className="my-2">Password</Text>
                <TextInput
                  className={"border p-2 rounded-md border-gray-200"}
                  placeholder="Password"
                  value={values.password}
                  onBlur={handleBlur("password")}
                  onChangeText={handleChange("password")}
                  secureTextEntry={showPassword}
                />
                <Text className="text-red-500">{errors.password}</Text>
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
                className="border-none text-white rounded-xl p-3 my-4 flex justify-center items-center bg-primary"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white ">
                  {loading ? "Loading..." : "Login"}
                </Text>
              </TouchableOpacity>
              <View className="flex flex-row justify-center gap-2 items-center">
                <Text>Already signed up?</Text>
                <Link href={"auth/signup"} className="text-dark">
                  <Text>Sign Up</Text>
                </Link>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
