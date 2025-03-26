import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import { useHallState } from "./context"; // Adjust path
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IHall } from "./model"; // Adjust path
import { router, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

const BookingScreen: React.FC = () => {
  const { hallData } = useLocalSearchParams();
  const item: IHall = hallData ? JSON.parse(hallData as string) : null;
  const { _id = "", name = "" } = item || {};
  const { bookHall, loading } = useHallState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerType, setPickerType] = useState<string | null>(null);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  const showDatePicker = (type: string) => {
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date, setFieldValue: Function) => {
    if (pickerType === "bookedFromDate") {
      setFieldValue("bookedFromDate", selectedDate);
    } else if (pickerType === "bookedFromTime") {
      setFieldValue("bookedFromTime", selectedDate);
    } else if (pickerType === "bookedToDate") {
      setFieldValue("bookedToDate", selectedDate);
    } else if (pickerType === "bookedToTime") {
      setFieldValue("bookedToTime", selectedDate);
    }
    hideDatePicker();
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const {
      duration,
      bookedFromDate,
      bookedFromTime,
      bookedToDate,
      bookedToTime,
    } = values;

    const bookedFrom = new Date(bookedFromDate);
    bookedFrom.setHours(bookedFromTime.getHours());
    bookedFrom.setMinutes(bookedFromTime.getMinutes());

    const bookedTo = new Date(bookedToDate);
    bookedTo.setHours(bookedToTime.getHours());
    bookedTo.setMinutes(bookedToTime.getMinutes());

    try {
      const result = await bookHall(_id, {
        bookedFrom: bookedFrom.toISOString(),
        bookedTo: bookedTo.toISOString(),
        duration,
      });
      if (result) {
        router.replace("/hall");
      }
    } catch (error) {
      console.error("Error booking hall:", error);
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <ScrollView className="px-6 py-4">
        <Text className="text-center text-xl font-bold text-dark mb-6">
          {`Book ${name} Lecture Hall`}
        </Text>

        <Formik
          initialValues={{
            duration: "",
            bookedFromDate: new Date(),
            bookedFromTime: new Date(),
            bookedToDate: new Date(),
            bookedToTime: new Date(),
          }}
          onSubmit={handleSubmit}
        >
          {({
            setFieldValue,
            values,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <View className="space-y-6">
              {/* Duration */}
              <View>
                <Text className="text-dark font-semibold mb-1">
                  Duration (hours)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={values.duration}
                  placeholder="Enter duration"
                  className="bg-white p-3 rounded-xl border border-gray-200 text-dark"
                  onChangeText={handleChange("duration")}
                />
              </View>

              {/* Booked From Date */}
              <View>
                <Text className="text-dark font-semibold mb-1">
                  Booked From Date
                </Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("bookedFromDate")}
                  className="bg-white p-3 rounded-xl border border-gray-200"
                >
                  <Text className="text-dark">
                    {values.bookedFromDate.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Booked From Time */}
              <View>
                <Text className="text-dark font-semibold mb-1">
                  Booked From Time
                </Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("bookedFromTime")}
                  className="bg-white p-3 rounded-xl border border-gray-200"
                >
                  <Text className="text-dark">
                    {values.bookedFromTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Booked To Date */}
              <View>
                <Text className="text-dark font-semibold mb-1">
                  Booked To Date
                </Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("bookedToDate")}
                  className="bg-white p-3 rounded-xl border border-gray-200"
                >
                  <Text className="text-dark">
                    {values.bookedToDate.toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Booked To Time */}
              <View>
                <Text className="text-dark font-semibold mb-1">
                  Booked To Time
                </Text>
                <TouchableOpacity
                  onPress={() => showDatePicker("bookedToTime")}
                  className="bg-white p-3 rounded-xl border border-gray-200"
                >
                  <Text className="text-dark">
                    {values.bookedToTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
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
                  <Text className="text-white font-semibold">Book Hall</Text>
                )}
              </TouchableOpacity>

              {/* Date/Time Picker */}
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={pickerType?.includes("Date") ? "date" : "time"}
                onConfirm={(date) => handleConfirm(date, setFieldValue)}
                onCancel={hideDatePicker}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingScreen;
