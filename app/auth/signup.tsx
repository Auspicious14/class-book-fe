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
  Image,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import * as Yup from "yup";
import { AntDesign, Feather } from "@expo/vector-icons";
import Toast from "react-native-root-toast";
import Dropdown from "react-native-input-select";
import { useNavigation } from "@react-navigation/native";
import { axiosApi } from "../../components/api";
import { useAuthState } from "./context";
import { LinearGradient } from "expo-linear-gradient";
import { CustomText } from "../../components";
import { Link } from "expo-router";

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Please enter your password.").min(6),
  confirmPassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

const SignUpScreen = () => {
  const { auth, signup, loading } = useAuthState();
  const windowHeight = Dimensions.get("window").height;
  const navigation: any = useNavigation();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");

  const handleSubmit = async (val: any) => {
    const { email, password, firstName, lastName } = val;
    try {
      await signup({ email, password, firstName, lastName, role });
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
            source={require("../../assets/images/Thesis-pana.png")}
            className="w-48 h-48 object-contain"
          />
          <CustomText className="text-2xl text-white mt-4">
            Create an Account
          </CustomText>
        </LinearGradient>

        <ScrollView className="flex-1">
          <View className="bg-white rounded-t-3xl shadow-sm mx-6 -mt-12 p-6">
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={FormSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View className="space-y-6">
                  <View>
                    <CustomText className="text-dark text-sm font-semibold mb-1">
                      First Name
                    </CustomText>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                      placeholder="First Name"
                      placeholderTextColor="#6b7280"
                      value={values.firstName}
                      onBlur={handleBlur("firstName")}
                      onChangeText={handleChange("firstName")}
                      autoCapitalize="words"
                    />
                    {errors.firstName && (
                      <CustomText className="text-red-500 text-sm mt-1">
                        {errors.firstName}
                      </CustomText>
                    )}
                  </View>

                  <View>
                    <CustomText className="text-dark text-sm font-semibold mb-1">
                      Last Name
                    </CustomText>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                      placeholder="Last Name"
                      placeholderTextColor="#6b7280"
                      value={values.lastName}
                      onBlur={handleBlur("lastName")}
                      onChangeText={handleChange("lastName")}
                      autoCapitalize="words"
                    />
                    {errors.lastName && (
                      <CustomText className="text-red-500 text-sm mt-1">
                        {errors.lastName}
                      </CustomText>
                    )}
                  </View>
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
                      Role
                    </CustomText>
                    <Dropdown
                      options={[
                        { label: "Admin", value: "admin" },
                        { label: "Class Representative", value: "classRep" },
                        { label: "Student", value: "student" },
                      ]}
                      selectedValue={role}
                      onValueChange={(value: string) => setRole(value)}
                      placeholder="Select a role"
                      dropdownStyle={{
                        backgroundColor: "white",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#d1d5db",
                        padding: 12,
                      }}
                      dropdownContainerStyle={{
                        backgroundColor: "white",
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#d1d5db",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                      placeholderStyle={{
                        color: "#6b7280",
                        fontSize: 16,
                      }}
                      selectedItemStyle={{
                        color: "#1f2937", // Matches text-dark
                        fontSize: 16,
                      }}
                      // listItemStyle={{
                      //   paddingVertical: 8,
                      //   paddingHorizontal: 12,
                      // }}
                      primaryColor="#3b82f6"
                    />
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
                        className="absolute right-3 top-1/2 -translate-y-1/2"
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

                  <View>
                    <CustomText className="text-dark text-sm font-semibold mb-1">
                      Confirm Password
                    </CustomText>
                    <View className="relative">
                      <TextInput
                        className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                        placeholder="***********"
                        placeholderTextColor="#6b7280"
                        value={values.confirmPassword}
                        onBlur={handleBlur("confirmPassword")}
                        onChangeText={handleChange("confirmPassword")}
                        secureTextEntry={showPassword}
                      />
                      <TouchableOpacity
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Feather
                          name={showPassword ? "eye-off" : "eye"}
                          size={20}
                          color="#6b7280"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <CustomText className="text-red-500 text-sm mt-1">
                        {errors.confirmPassword}
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
                          Signup
                        </CustomText>
                      )}
                    </CustomText>
                  </TouchableOpacity>

                  <View className="flex-row justify-center items-center space-x-2">
                    <CustomText className="text-dark text-sm">
                      Already signed up?
                    </CustomText>
                    <Link href="/auth/login">
                      <CustomText className="text-primary text-sm font-semibold">
                        Login
                      </CustomText>
                    </Link>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
