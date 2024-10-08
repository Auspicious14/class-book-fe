import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useHallState } from "./context";
import * as Yup from "yup";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation, useRoute } from "@react-navigation/native";

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Hall Name is required"),
  location: Yup.string().required("Location is required"),
  capacity: Yup.string().required("Capacity is required"),
  description: Yup.string().required("Description is required"),
});

const CreateHallScreen = () => {
  const route = useRoute();
  const navigation: any = useNavigation();
  const { item }: any = route.params;

  const {
    _id = "",
    images = [],
    location = "",
    name = "",
    description = "",
    capacity = "",
    available = false,
  } = item;

  const { saveHall, loading } = useHallState();
  const [image, setImage] = useState<any>(images[0] || null);

  useEffect(() => {
    setImage(images[0]);
    StatusBar.setBarStyle("light-content");
  }, [StatusBar, images]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
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
    saveHall({ _id, available, ...val }, _id ? images[0] : image).then(
      (res) => {
        if (res) {
          navigation.nvigate("HallPage");
        }
      }
    );
  };

  return (
    <SafeAreaView>
      <View className="bg-secondary p-8 h-full">
        <Text className="text-center my-4 text-xl font-bold">
          {_id ? `Update ${name} Lecture Hall` : "Create a Lecture Hall"}
        </Text>
        <Formik
          initialValues={{
            name: name || "",
            description: description || "",
            location: location || "",
            capacity: capacity || "",
            // available: available || false,
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
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
                    alt={image?.name as string}
                    className="rounded-md m-auto mt-6"
                  />
                </TouchableOpacity>
              )}
              <Text className="my-2">Name</Text>
              <TextInput
                className={"border p-2 rounded-md border-gray-200"}
                placeholder="Name"
                value={values.name}
                onBlur={handleBlur("name")}
                onChangeText={handleChange("name")}
              />
              <Text className={`text-red-500 ${errors.name && "my-2"}`}>
                {errors.name as string}
              </Text>
              <Text className="my-2">Description</Text>
              <TextInput
                inputMode="text"
                multiline
                className={"border p-2 rounded-md border-gray-200"}
                placeholder="Name"
                value={values.description}
                onBlur={handleBlur("description")}
                onChangeText={handleChange("description")}
              />
              <Text className={`text-red-500 ${errors.description && "my-2"}`}>
                {errors.description as string}
              </Text>
              <Text className="my-2">Capacity</Text>
              <TextInput
                className={"border p-2 rounded-md border-gray-200"}
                placeholder="Name"
                value={values.capacity}
                onBlur={handleBlur("capacity")}
                onChangeText={handleChange("capacity")}
              />
              <Text className={`text-red-500 ${errors.capacity && "my-2"}`}>
                {errors.capacity as string}
              </Text>
              <Text className="">Location</Text>
              <TextInput
                className={"border p-2 rounded-md border-gray-200"}
                placeholder="Location"
                value={values.location}
                onBlur={handleBlur("location")}
                onChangeText={handleChange("location")}
              />
              <Text className={`text-red-500 ${errors.location && "my-2"}`}>
                {errors.location as string}
              </Text>

              <TouchableOpacity
                disabled={loading}
                className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-primary"
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
