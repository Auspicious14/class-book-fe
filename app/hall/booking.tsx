import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { Formik } from "formik";
import { useHallState } from "./context";
// import { router, useLocalSearchParams } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IHall } from "./model";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-root-toast";
import { router, useLocalSearchParams } from "expo-router";

const BookingScreen: React.FC = () => {
  const route = useRoute();
  const { hallData } = useLocalSearchParams();
  const item: IHall = hallData ? JSON.parse(hallData as string) : null;
  const { _id = "", name = "" }: any = item;
  const { bookHall, loading } = useHallState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerType, setPickerType] = useState<string | null>(null);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
  }, []);

  const handeShowDatePicker = (type: string) => {
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date, setFieldValue: Function) => {
    console.log({
      selectedDate: selectedDate.toLocaleTimeString(),
      pickerType,
    });
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

  const handleSubmit = async (values: any) => {
    const {
      duration,
      bookedFromDate,
      bookedFromTime,
      bookedToDate,
      bookedToTime,
    } = values;

    const bookedFrom = new Date(bookedFromDate);
    bookedFrom.setHours(bookedFromTime.getHours() + 1);
    bookedFrom.setMinutes(bookedFromTime.getMinutes());

    const bookedTo = new Date(bookedToDate);
    bookedTo.setHours(bookedToTime.getHours() + 1);
    bookedTo.setMinutes(bookedToTime.getMinutes());

    console.log({
      bookedFrom: bookedFrom.toISOString(),
      bookedTo: bookedTo.toISOString(),
    });

    bookHall(_id, {
      bookedFrom: bookedFrom.toISOString(),
      bookedTo: bookedTo.toISOString(),
      duration,
    }).then((res) => {
      if (res) {
        router.replace("/hall");
      }
    });
  };

  return (
    <SafeAreaView className={"p-4"}>
      <Text className={"text-xl my-4 text-center"}>
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
        {({ setFieldValue, values, handleChange }) => (
          <View>
            <View>
              <Text>Duration (hours)</Text>
              <TextInput
                keyboardType="numeric"
                value={values.duration}
                placeholder="Enter duration for hall to book"
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
                onChangeText={handleChange("duration")}
              />
            </View>

            <View>
              <Text>Booked From Date</Text>
              <TouchableOpacity
                onPress={() => handeShowDatePicker("bookedFromDate")}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedFromDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Booked From Time</Text>
              <TouchableOpacity
                onPress={() => handeShowDatePicker("bookedFromTime")}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedFromTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Booked To Date</Text>
              <TouchableOpacity
                onPress={() => handeShowDatePicker("bookedToDate")}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedToDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text>Booked To Time</Text>
              <TouchableOpacity
                onPress={() => handeShowDatePicker("bookedToTime")}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedToTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              disabled={loading}
              className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-primary"
              onPress={() => handleSubmit(values)}
            >
              <Text className="text-white">
                {loading ? <ActivityIndicator /> : " Book Hall"}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={pickerType?.includes("Date") ? "date" : "time"}
              onConfirm={(date) => handleConfirm(date, setFieldValue)}
              onCancel={hideDatePicker}
            />
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default BookingScreen;
