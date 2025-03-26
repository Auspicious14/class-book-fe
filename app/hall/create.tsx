import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import {
  Image,
  ScrollView,
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
import { router, useLocalSearchParams } from "expo-router";
import { IHall } from "./model";

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Hall Name is required"),
  location: Yup.string().required("Location is required"),
  capacity: Yup.string().required("Capacity is required"),
  description: Yup.string().required("Description is required"),
});

const CreateHallScreen = () => {
  const { saveHall, loading } = useHallState();
  const { hallData } = useLocalSearchParams();
  const item: IHall = hallData ? JSON.parse(hallData as string) : null;

  const initialHall: Partial<IHall> = {
    _id: "",
    images: [],
    location: "",
    name: "",
    description: "",
    capacity: "",
    available: false,
  };
  const hall = item || initialHall;
  const [image, setImage] = useState<any>(hall.images[0] || null);

  useEffect(() => {
    if (hall?.images) {
      setImage(hall.images[0]);
    }
    StatusBar.setBarStyle("light-content");
  }, [StatusBar, hall.images]);

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

  const handleSubmit = async (values: Partial<IHall>, actions: any) => {
    const hallToSave = {
      ...hall,
      ...values,
      available: hall.available,
    };

    try {
      const savedHall = await saveHall(
        hallToSave,
        hall._id ? hall.images[0] : image
      );
      if (savedHall) {
        router.replace("/hall");
      }
    } catch (error) {
      console.error("Error saving hall:", error);
      actions.setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView className="px-6 py-4">
        <Text className="text-center text-xl font-bold text-dark mb-6">
          {hall._id
            ? `Update ${hall.name} Lecture Hall`
            : "Create a Lecture Hall"}
        </Text>

        <Formik
          initialValues={{
            name: hall.name,
            description: hall.description,
            location: hall.location,
            capacity: hall.capacity,
          }}
          validationSchema={FormSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleBlur,
            handleChange,
            values,
            handleSubmit,
            errors,
            isSubmitting,
          }) => (
            <View className="space-y-6">
              {/* Image Upload */}
              <View className="items-center">
                {!image ? (
                  <TouchableOpacity
                    className="w-48 h-48 bg-white rounded-xl shadow-sm border border-gray-200 flex justify-center items-center"
                    onPress={pickImage}
                  >
                    <AntDesign name="plus" size={40} color="#6b7280" />
                    <Text className="text-dark font-semibold mt-2">
                      Upload Image
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={pickImage}>
                    <Image
                      source={{ uri: image.uri }}
                      className="w-48 h-48 rounded-xl border border-gray-200"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Form Fields */}
              <View>
                <Text className="text-dark font-semibold mb-1">Name</Text>
                <TextInput
                  className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                  placeholder="Hall Name"
                  value={values.name}
                  onBlur={handleBlur("name")}
                  onChangeText={handleChange("name")}
                />
                {errors.name && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-dark font-semibold mb-1">
                  Description
                </Text>
                <TextInput
                  className="bg-white p-3 rounded-xl border border-gray-200 text-dark h-24"
                  placeholder="Description"
                  value={values.description}
                  onBlur={handleBlur("description")}
                  onChangeText={handleChange("description")}
                  multiline
                />
                {errors.description && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-dark font-semibold mb-1">Capacity</Text>
                <TextInput
                  className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                  placeholder="Capacity"
                  value={values.capacity}
                  onBlur={handleBlur("capacity")}
                  onChangeText={handleChange("capacity")}
                  keyboardType="numeric"
                />
                {errors.capacity && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.capacity}
                  </Text>
                )}
              </View>

              <View>
                <Text className="text-dark font-semibold mb-1">Location</Text>
                <TextInput
                  className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                  placeholder="Location"
                  value={values.location}
                  onBlur={handleBlur("location")}
                  onChangeText={handleChange("location")}
                />
                {errors.location && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.location}
                  </Text>
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                disabled={loading || isSubmitting}
                className={`bg-primary py-3 rounded-xl flex-row justify-center items-center ${
                  loading || isSubmitting ? "opacity-80" : ""
                }`}
                onPress={() => handleSubmit()}
              >
                {loading || isSubmitting ? (
                  <>
                    <AntDesign
                      name="loading1"
                      size={20}
                      color="white"
                      className="mr-2"
                    />
                    <Text className="text-white font-semibold">
                      Processing...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white font-semibold">
                    {hall._id ? "Update Hall" : "Create Hall"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateHallScreen;
