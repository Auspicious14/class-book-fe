import React, { useState } from "react";
import {
  View,
  Text,
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
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuthState } from "./context";

const FormSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email"),
  password: Yup.string().required().min(6),
});

const LoginScreen = () => {
  const windowHeight = Dimensions.get("window").height;
  const navigation: any = useNavigation();
  const { Login, loading } = useAuthState();
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const handleSubmit = async (val: any) => {
    const { email, password } = val;
    Login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
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
                <Text className="my-2 text-dark">Email</Text>
                <TextInput
                  className={"border p-2 rounded-md border-gray-200"}
                  placeholder="johndoe@hr.inc"
                  value={values.email}
                  onBlur={handleBlur("email")}
                  onChangeText={handleChange("email")}
                />
                <Text className="text-red-500">{errors.email}</Text>
                <View className="relative">
                  <Text className="my-2 text-dark">Password</Text>
                  <TextInput
                    className={"border p-2 rounded-md border-gray-200"}
                    placeholder="***********"
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
                  <Text className="text-dark">
                    New to this? create an account here
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Signup")}
                  >
                    <Text className="text-primary">Signup</Text>
                  </TouchableOpacity>
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
