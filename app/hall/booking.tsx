import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";
// import DatePicker from "react-native-date-picker";

const BookingScreen: React.FC = ({ route }: any) => {
  const [showPicker, setShowPicker] = useState<{
    show: boolean;
    type?:
      | "bookedFromDate"
      | "bookedFromTime"
      | "bookedToDate"
      | "bookedToTime";
  }>({ show: false });
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    const {
      duration,
      bookedFromDate,
      bookedFromTime,
      bookedToDate,
      bookedToTime,
    } = values;

    const bookedFrom = new Date(
      bookedFromDate.getFullYear(),
      bookedFromDate.getMonth(),
      bookedFromDate.getDate(),
      bookedFromTime.getHours(),
      bookedFromTime.getMinutes()
    );

    const bookedTo = new Date(
      bookedToTime.getFullYear(),
      bookedToDate.getMonth(),
      bookedToDate.getDate(),
      bookedToTime.getHours(),
      bookedToTime.getMinutes()
    );
    console.log({ hall: route?.params?.item?._id });

    setLoading(true);

    try {
      const { api } = await axiosApi();
      const res = await api.post(`/book/hall`, {
        hallId: route?.params?.item?._id,
        duration: parseFloat(duration),
        bookedFrom,
        bookedTo,
      });

      setLoading(false);
      Toast.show(res?.data.message, {
        backgroundColor: "green",
        textColor: "white",
      });
    } catch (error: any) {
      setLoading(false);
      Toast.show(error.response.data, {
        backgroundColor: "red",
        textColor: "white",
      });
    }
  };

  return (
    <SafeAreaView className={"p-4"}>
      <Text className={"text-xl my-4 text-center"}>
        {`Book ${route?.params?.item?.name} Lecture Hall`}
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
              <Text className="">Duration (hours)</Text>
              <TextInput
                keyboardType="numeric"
                value={values.duration}
                placeholder="Enter duration for hall to book"
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
                onChangeText={handleChange("duration")}
              />
            </View>
            <View>
              <Text className="">Booked From Date</Text>
              <TouchableOpacity
                onPress={() =>
                  setShowPicker({ show: true, type: "bookedFromDate" })
                }
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedFromDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="">Booked From Time</Text>
              <TouchableOpacity
                onPress={() =>
                  setShowPicker({ show: true, type: "bookedFromTime" })
                }
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedFromTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="">Booked To Date</Text>
              <TouchableOpacity
                onPress={() =>
                  setShowPicker({ show: true, type: "bookedToDate" })
                }
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedToDate.toDateString()}</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="">Booked To Time</Text>
              <TouchableOpacity
                onPress={() =>
                  setShowPicker({ show: true, type: "bookedToTime" })
                }
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{values.bookedToTime.toLocaleTimeString()}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              disabled={loading}
              className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-blue-800"
              onPress={() => handleSubmit(values)}
            >
              <Text className="text-white ">
                {loading ? "Loading..." : "Book Hall"}
              </Text>
            </TouchableOpacity>

            {
              <Modal
                visible={showPicker.show}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker({ show: false })}
              >
                <View>
                  <View style={{}}>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={
                        showPicker.type === "bookedFromDate"
                          ? values.bookedFromDate
                          : showPicker.type === "bookedFromTime"
                          ? values.bookedFromTime
                          : showPicker.type === "bookedToDate"
                          ? values.bookedToDate
                          : values.bookedToTime
                      }
                      mode={
                        showPicker.type === "bookedFromDate" ||
                        showPicker.type === "bookedToDate"
                          ? "date"
                          : "time"
                      }
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        const currentDate = new Date(
                          selectedDate!.getTime() -
                            selectedDate!.getTimezoneOffset() * 60000
                        );
                        setShowPicker({ show: false });
                        if (showPicker.type === "bookedFromDate") {
                          setFieldValue("bookedFromDate", currentDate);
                        } else if (showPicker.type === "bookedFromTime") {
                          setFieldValue("bookedFromTime", currentDate);
                        } else if (showPicker.type === "bookedToDate") {
                          setFieldValue("bookedToDate", currentDate);
                        } else if (showPicker.type === "bookedToTime") {
                          setFieldValue("bookedToTime", currentDate);
                        }
                      }}
                      // collapsable
                      // onTouchCancel={() => setShowPicker({ show: false })}
                    />
                  </View>
                </View>
              </Modal>
            }
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default BookingScreen;
