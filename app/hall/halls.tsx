import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Button,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall } from "./model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { axiosApi } from "../../components/api";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const columnWidth = screenWidth / numColumns;

const HallsScreen = () => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.get("/halls");
      setLoading(false);
      setHalls(response.data?.data);
    } catch (error: any) {
      setLoading(false);
      Toast.show(error?.message, {
        backgroundColor: "red",
        textColor: "white",
      });
    }
  };
  useEffect(() => {
    if (token !== "") {
      fetchHalls();
    }
    fetchToken();
  }, [token]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }
  const navigateToCreateHall = () => {
    navigation.navigate("hall/create");
  };

  return (
    <SafeAreaView className="p-8">
      {loading && <Text>Loading...</Text>}
      {!loading && halls.length > 0 && (
        <View className="py-8">
          <FlatList
            data={halls}
            numColumns={numColumns}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  maxWidth: columnWidth,
                  flex: 1,
                  marginHorizontal: 20,
                  marginBottom: 20,
                }}
                className=" items-center justify-between p-3 border-2 border-gray-400 rounded-md"
                onPress={() =>
                  navigation.navigate("hall/booking", {
                    item: {
                      _id: item._id,
                      name: item.name,
                      location: item.location,
                    },
                  })
                }
              >
                <Text>{item.name}</Text>
                <Text className="">{item.location}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <Button
        title="Create New Hall"
        onPress={navigateToCreateHall}
        // style={"absolute top-0 bottom-0"}
      />
    </SafeAreaView>
  );
};

export default HallsScreen;
