import React, { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-root-toast";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Please enter your password.").min(6),
  confirmPassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

const SignUpScreen = () => {
  const route = useLocalSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const handleSubmit = async (val: any) => {
    const { email, password } = val;

    setLoading(true);
    try {
      console.log("heerree");
      const response = await axios({
        url: "http://192.168.213.241:2000/auth/signup",
        method: "POST",
        data: { email, password, role: route.role },
      });

      setLoading(false);
      const data = response.data;
      Toast.show(data, { backgroundColor: "green", textColor: "white" });
      console.log(data, "dataaa");
      router.push("auth/login");
    } catch (error: any) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <SafeAreaView>
          <View className={"p-8"}>
            <Text className={"text-2xl mb-4 text-center"}>Welcome</Text>
            <Text className={"mb-4 text-center"}>Sign up</Text>
            <ImageBackground
              source={require("../../assets/images/partial-react-logo.png")}
              className="flex justify-center"
            />
            <>
              <Formik
                initialValues={{ email: "", password: "", confirmPassword: "" }}
                validationSchema={FormSchema}
                onSubmit={handleSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => (
                  <View>
                    <Text className="my-2">Email</Text>
                    <TextInput
                      className={"border p-2 mb-4 rounded-md border-gray-200"}
                      placeholder="Email"
                      value={values.email}
                      onBlur={handleBlur("email")}
                      onChangeText={handleChange("email")}
                    />
                    <Text className="text-red-500">{errors.email}</Text>
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
                    <View className="relative">
                      <Text className="my-2">Confirm Password</Text>
                      <TextInput
                        className={"border p-2 mb-4 rounded-md border-gray-200"}
                        placeholder="Password"
                        value={values.confirmPassword}
                        onBlur={handleBlur("confirmPassword")}
                        onChangeText={handleChange("confirmPassword")}
                        secureTextEntry={showPassword}
                      />
                      <Text className="text-red-500">
                        {errors.confirmPassword}
                      </Text>
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
                        {loading ? "Loading..." : "Sign Up"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            </>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
