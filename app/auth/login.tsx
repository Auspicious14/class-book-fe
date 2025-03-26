import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign, Feather } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import { useAuthState } from "./context";
import { Link, Redirect } from "expo-router";
import { CustomText } from "../../components";
import { LinearGradient } from "expo-linear-gradient";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required").min(6),
});

const LoginScreen = () => {
  const windowHeight = Dimensions.get("window").height;
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const { auth, login, loading } = useAuthState();

  if (auth && auth.token) {
    if (auth.role === "student") return <Redirect href="/(student)" />;
    if (auth.role === "admin") return <Redirect href="/(admin)" />;
    if (auth.role === "classRep") return <Redirect href="/(classRep)" />;
  }

  const onSubmit = async (val: any) => {
    const { email, password } = val;
    try {
      await login(email, password);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred during login";
      Toast.show(errorMessage, {
        backgroundColor: "red",
        textColor: "white",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <SafeAreaView className="flex-1 bg-secondary">
        <LinearGradient
          colors={["#4caf50", "#6b7280"]}
          className="h-72 flex justify-center items-center"
        >
          <Image
            source={require("../../assets/images/Key-pana.png")}
            className="w-48 h-48 object-contain"
          />
          <CustomText className="text-2xl !text-white mt-4">Login</CustomText>
        </LinearGradient>

        <View className="bg-white rounded-t-3xl shadow-sm mx-6 -mt-12 p-6 flex-1">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={FormSchema}
            onSubmit={onSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View className="space-y-6">
                <View>
                  <CustomText className="text-dark text-sm font-semibold mb-1">
                    Email
                  </CustomText>
                  <TextInput
                    className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                    placeholder="johndoe@hr.inc"
                    placeholderTextColor="#6b7280"
                    value={values.email}
                    onBlur={handleBlur("email")}
                    onChangeText={handleChange("email")}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {errors.email && (
                    <CustomText className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </CustomText>
                  )}
                </View>

                <View>
                  <CustomText className="text-dark text-sm font-semibold mb-1">
                    Password
                  </CustomText>
                  <View className="relative">
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                      placeholder="***********"
                      placeholderTextColor="#6b7280"
                      value={values.password}
                      onBlur={handleBlur("password")}
                      onChangeText={handleChange("password")}
                      secureTextEntry={showPassword}
                    />
                    <TouchableOpacity
                      className="absolute right-3 top-1/4 -translate-y-1/2"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6b7280"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <CustomText className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </CustomText>
                  )}
                </View>

                <TouchableOpacity
                  disabled={loading}
                  className={`bg-primary py-3 rounded-xl flex justify-center items-center ${
                    loading ? "opacity-80" : ""
                  }`}
                  onPress={() => handleSubmit()}
                >
                  <CustomText className="text-white text-base font-semibold">
                    {loading ? (
                      <>
                        <AntDesign
                          name="loading1"
                          size={20}
                          color="white"
                          className="mr-2"
                        />
                        <CustomText className="text-white font-semibold">
                          Processing...
                        </CustomText>
                      </>
                    ) : (
                      <CustomText className="text-white font-semibold">
                        Login
                      </CustomText>
                    )}
                  </CustomText>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center space-x-2">
                  <Link href="/auth/signup">
                    <CustomText className="text-primary text-sm font-semibold">
                      New to this? Create an account
                    </CustomText>
                  </Link>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
