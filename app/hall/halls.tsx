import React, { useEffect, useState } from "react";
import axios from "axios";
import { View, Button, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall } from "./model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HallsScreen = () => {
  const [token, setToken] = useState<string>("");
  const [halls, setHalls] = useState<IHall[]>([]);
  const navigation: any = useNavigation();

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

  const fetchHalls = async () => {
    try {
      const response = await axios({
        url: "http://192.168.25.241:2000/halls",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data?.data, "esponse");
      setHalls(response.data?.data);
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
  };
  useEffect(() => {
    fetchToken();
    fetchHalls();
  }, []);

  const navigateToCreateHall = () => {
    navigation.navigate("halls/create");
  };

  console.log(halls, "halls");

  return (
    <SafeAreaView>
      <Button title="Create New Hall" onPress={navigateToCreateHall} />
      <FlatList
        data={halls}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.location}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HallsScreen;
