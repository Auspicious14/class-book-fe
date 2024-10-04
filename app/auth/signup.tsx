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
import { Feather } from "@expo/vector-icons";
import { Link, router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-root-toast";
import Dropdown from "react-native-input-select";
import { useNavigation } from "@react-navigation/native";
import { useAuthState } from "./context";

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
  const windowHeight = Dimensions.get("window").height;
  const navigation: any = useNavigation();
  const { Signup, loading } = useAuthState();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [role, setRole] = useState<string>("");

  const handleSubmit = async (val: any) => {
    const { email, password, firstName, lastName } = val;
    Signup({ email, password, firstName, lastName, role });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <SafeAreaView
        style={{ flexGrow: 1, justifyContent: "center", padding: 20 }}
      >
        <View className={"bg-secondary p-8"}>
          <View className={"flex justify-center items-center "}>
            <Image
              source={require("../../assets/images/Thesis-pana.png")}
              className="flex justify-center w-40 h-40 object-cover"
            />
            <Text className={"text-2xl mb-4 text-center text-dark"}>
              Create an Account
            </Text>
          </View>
          <ScrollView style={{ height: windowHeight - 280 }}>
            <>
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
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                }) => (
                  <>
                    <Text className="mb-2 text-dark">First Name</Text>
                    <TextInput
                      className={"border p-2 rounded-md border-gray-200 "}
                      placeholder="First Name"
                      value={values.firstName}
                      onBlur={handleBlur("firstName")}
                      onChangeText={handleChange("firstName")}
                    />
                    <Text className="text-red-500">{errors.firstName}</Text>
                    <Text className="mb-2 text-dark">Last Name</Text>
                    <TextInput
                      className={"border p-2 rounded-md border-gray-200"}
                      placeholder="Last Name"
                      value={values.lastName}
                      onBlur={handleBlur("lastName")}
                      onChangeText={handleChange("lastName")}
                    />
                    <Text className="text-red-500">{errors.lastName}</Text>
                    <Text className="my-2 text-dark">Email</Text>
                    <TextInput
                      className={"border p-2 rounded-md border-gray-200"}
                      placeholder="Email"
                      value={values.email}
                      onBlur={handleBlur("email")}
                      onChangeText={handleChange("email")}
                    />
                    <Text className="text-red-500">{errors.email}</Text>
                    <Dropdown
                      label="Role"
                      selectedValue={role}
                      options={[
                        { label: "Admin", value: "admin" },
                        { label: "Class Representative", value: "classRep" },
                        { label: "Student", value: "student" },
                      ]}
                      placeholder="Select a role"
                      autoCloseOnSelect
                      dropdownStyle={{
                        borderStyle: "solid",
                        borderColor: "gray",
                      }}
                      labelStyle={{
                        marginHorizontal: 4,
                        color: "#666666",
                        fontSize: 14,
                        fontWeight: "700",
                      }}
                      placeholderStyle={{
                        padding: 0,
                        margin: 0,
                        color: "#666666",
                      }}
                      primaryColor={"#666666"}
                      onValueChange={(value: string) => setRole(value)}
                    />
                    <View className="relative">
                      <Text className="mb-2 text-dark">Password</Text>
                      <TextInput
                        className={"border p-2 rounded-md border-gray-200"}
                        placeholder="Password"
                        value={values.password}
                        onBlur={handleBlur("password")}
                        onChangeText={handleChange("password")}
                        secureTextEntry={showPassword}
                      />
                      <Text className="text-red-500">{errors.password}</Text>
                      <View className="absolute top-12 right-4">
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
                      <Text className="mb-2 text-dark">Confirm Password</Text>
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
                      <View className="absolute top-12 right-4">
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
                      className="border-none rounded-xl p-3 my-4 flex justify-center items-center bg-primary"
                      onPress={() => handleSubmit()}
                    >
                      <Text className="text-white ">
                        {loading ? "Loading..." : "Sign Up"}
                      </Text>
                    </TouchableOpacity>

                    <View className="flex flex-row justify-center gap-2 items-center">
                      <Text className="text-dark">Already signed up?</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                      >
                        <Text className="text-primary">Login</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Formik>
            </>
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
