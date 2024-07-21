import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-root-toast";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { axiosApi } from "../../components/api";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Hall Name is required"),
  location: Yup.string().required("Locaion is required"),
});

const CreateHallScreen = ({ route }: any) => {
  console.log(route.params.item, "itemm");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const { _id, images, location, name } = route.params.item;
  const [image, setImage] = useState<any>(images);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      console.log(result.assets, "assets");
      const fileUri = result.assets[0].uri;
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          fileUri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );

        const fileBase64 = await FileSystem.readAsStringAsync(
          manipulatedImage.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        const dataUri = `data:image/jpeg;base64,${fileBase64}`;

        setImage({
          uri: dataUri,
          name: result.assets[0].fileName,
          type: result.assets[0].mimeType,
        });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
  };
  const handleSubmit = async (val: any, actions: any) => {
    const { name, location } = val;
    setLoading(true);
    try {
      const { api } = await axiosApi();
      let response;
      if (_id) {
        response = await api.put("/update/hall", {
          _id,
          name,
          location,
          files: [image],
        });
      } else {
        response = await api.post("/create/hall", {
          name,
          location,
          files: [image],
        });
      }

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

      if (data.error) {
        Toast.show(data.error, {
          backgroundColor: "red",
          textColor: "white",
        });
      }
    } catch (error: any) {
      console.log("response error", error);
      Toast.show(error?.message, {
        backgroundColor: "red",
        textColor: "white",
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="p-8 h-full">
        <Text className="text-center my-4 text-xl font-bold">
          {_id ? `Update ${name} Lecture Hall` : "Create a Lecture Hall"}
        </Text>
        <Formik
          initialValues={{ name: name || "", location: location || "" }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
        >
          {({ handleBlur, handleChange, values, handleSubmit, errors }) => (
            <View>
              {!image && (
                <TouchableOpacity
                  className="flex justify-center items-center p-4 border border-spacing-4 rounded-md m-auto"
                  onPress={() => pickImage()}
                >
                  <AntDesign name="plus" size={40} />
                  <Text>Upload Image</Text>
                </TouchableOpacity>
              )}
              {image && (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    source={{
                      uri: image?.uri,
                      height: 200,
                      width: 200,
                    }}
                    alt={image?.fileName as string}
                    className="rounded-md m-auto mt-6"
                  />
                </TouchableOpacity>
              )}
              <Text className="my-2">Name</Text>
              <TextInput
                className={"border p-2 mb-4 rounded-md border-gray-200"}
                placeholder="Name"
                value={values.name}
                onBlur={handleBlur("name")}
                onChangeText={handleChange("name")}
              />
              <Text className="text-red-500">{errors.name as string}</Text>
              <Text className="">Location</Text>
              <TextInput
                className={"border p-2 mb-4 rounded-md border-gray-200"}
                placeholder="Location"
                value={values.location}
                onBlur={handleBlur("location")}
                onChangeText={handleChange("location")}
              />
              <Text className="text-red-500">{errors.location as string}</Text>

              <TouchableOpacity
                disabled={loading}
                className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-blue-800"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white ">
                  {loading ? "Loading..." : _id ? "Update Hall" : "Create Hall"}
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
