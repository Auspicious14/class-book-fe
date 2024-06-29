import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import DateTimePicker from "@react-native-community/datetimepicker";

const BookingScreen: React.FC = () => {
  const [lectureHalls, setLectureHalls] = useState([] as any);
  const [selectedHall, setSelectedHall] = useState({} as any);
  const [time, setTime] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const token = AsyncStorage.getItem("token");
  const fetchLectureHalls = async () => {
    try {
      const response = await axios("http://192.168.213.241:2000/halls");
      const data = await response.data?.data;
      setLectureHalls(data);
    } catch (error) {
      console.error("Error fetching lecture halls:", error);
    }
  };
  useEffect(() => {
    fetchLectureHalls();
  }, []);

  const handleSubmit = async (val: any) => {
    setLoading(true);
    try {
      const response = await axios("http://192.168.213.241:2000/book/hall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify({ hallId: selectedHall, time }),
      });

      setLoading(false);

      Alert.alert("Success", "Lecture hall booked successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className={"p-4"}>
      <Text className={"text-xl mb-4"}>Book a Lecture Hall</Text>
      <FlatList
        data={lectureHalls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => setSelectedHall(item._id)}
            color={item._id === selectedHall ? "blue" : "gray"}
          />
        )}
      />
      <Formik
        initialValues={{ name: "", location: "", bookedUntil: "" }}
        validationSchema={""}
        onSubmit={handleSubmit}
      >
        {({ handleBlur, handleChange, values, errors }) => (
          <View>
            <Text className="my-2">Name</Text>
            <TextInput
              className={"border p-2 mb-4 rounded-md border-gray-200"}
              placeholder="Name"
              value={values.name}
              onBlur={handleBlur("name")}
              onChangeText={handleChange("name")}
            />
            <Text className="text-red-500">{errors.name}</Text>
            <Text className="">Location</Text>
            <TextInput
              className={"border p-2 mb-4 rounded-md border-gray-200"}
              placeholder="Location"
              value={values.location}
              onBlur={handleBlur("location")}
              onChangeText={handleChange("location")}
            />
            <Text className="text-red-500">{errors.location}</Text>
            <Text className="">Duration</Text>
            <TouchableOpacity
              onPress={() => setShow(true)}
              className="border p-2 py-4 mb-4 rounded-md border-gray-200"
            >
              <Text>{date.toDateString()}</Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={"date"}
                is24Hour={true}
                onChange={(e, date) => {
                  setDate(date as Date);
                  setShow(true);
                }}
              />
            )}
            <TouchableOpacity
              disabled={loading}
              className="border-none text-white rounded-xl p-3 flex justify-center items-center bg-blue-800"
              onPress={handleSubmit}
            >
              <Text className="text-white ">
                {loading ? "Loading..." : "Book Hall"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default BookingScreen;
