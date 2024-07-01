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
  const [time, setTime] = useState<Date>(new Date());
  const [bookedFrom, setBookedFrom] = useState<Date>(new Date());
  const [bookedTo, setBookedTo] = useState<Date>(new Date());
  const [show, setShow] = useState<{
    show: boolean;
    type?: "time" | "bookedFrom" | "bookedTo";
  }>({ show: false });
  const [loading, setLoading] = useState<boolean>(false);

  const token = AsyncStorage.getItem("token");
  const fetchLectureHalls = async () => {
    try {
      const response = await axios("http://192.168.25.241:2000/halls");
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
        initialValues={{ duration: "", bookedFrom: "", bookedTo: "" }}
        validationSchema={""}
        onSubmit={handleSubmit}
      >
        {({ handleBlur, handleChange, values, errors }) => (
          <View>
            <View>
              <Text className="">Duration</Text>
              <TouchableOpacity
                onPress={() => setShow({ show: true, type: "time" })}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{time.toLocaleTimeString()}</Text>
              </TouchableOpacity>
              {show.type == "time" && show.show == true && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={time}
                  mode={"time"}
                  is24Hour={true}
                  onChange={(e, date) => {
                    setTime(date as Date);
                    setShow({ show: true, type: "time" });
                  }}
                />
              )}
            </View>
            <View>
              <Text className="">Booked From</Text>
              <TouchableOpacity
                onPress={() => setShow({ show: true, type: "bookedFrom" })}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{bookedFrom.toDateString()}</Text>
              </TouchableOpacity>
              {show.show && show.type == "bookedFrom" && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={bookedFrom}
                  mode={"date"}
                  is24Hour={true}
                  onChange={(e, date) => {
                    setBookedFrom(date as Date);
                    setShow({ show: true, type: "bookedFrom" });
                  }}
                />
              )}
            </View>
            <View>
              <Text className="">Booked To</Text>
              <TouchableOpacity
                onPress={() => setShow({ show: true, type: "bookedTo" })}
                className="border p-2 py-4 mb-4 rounded-md border-gray-200"
              >
                <Text>{bookedTo.toDateString()}</Text>
              </TouchableOpacity>
              {show.show && show.type == "bookedTo" && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={bookedTo}
                  mode={"date"}
                  is24Hour={true}
                  onChange={(e, date) => {
                    setBookedTo(date as Date);
                    setShow({ show: true, type: "bookedTo" });
                  }}
                />
              )}
            </View>
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
