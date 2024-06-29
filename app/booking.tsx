import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTailwind } from "nativewind";

const BookingScreen: React.FC = () => {
  const [lectureHalls, setLectureHalls] = useState([] as any);
  const [selectedHall, setSelectedHall] = useState({} as any);
  const [time, setTime] = useState("");

  const token = AsyncStorage.getItem("token");
  const fetchLectureHalls = async () => {
    try {
      const response = await axios("http://your-backend-url/api/lectureHalls");
      const data = await response.data?.data;
      setLectureHalls(data);
    } catch (error) {
      console.error("Error fetching lecture halls:", error);
    }
  };
  useEffect(() => {
    fetchLectureHalls();
  }, []);

  const bookHall = async () => {
    // Call backend to book hall and send notifications
    try {
      const response = await axios(
        "http://your-backend-url/api/lectureHalls/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: JSON.stringify({ hallId: selectedHall, time }),
        }
      );

      if (response.status !== 200) {
        throw new Error("Error booking lecture hall");
      }

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
      <TextInput
        className={"border p-2 mt-4"}
        placeholder="Booking Time (YYYY-MM-DDTHH:mm:ss)"
        value={time}
        onChangeText={setTime}
      />
      <Button title="Book" onPress={bookHall} />
    </View>
  );
};

export default BookingScreen;
