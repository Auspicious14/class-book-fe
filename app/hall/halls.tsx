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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall } from "./model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";
import { axiosApi } from "../../components/api";
import { ImageBackground } from "react-native";
import { AntDesign } from "@expo/vector-icons";

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
  const navigateToCreateHall = (item?: IHall) => {
    navigation.navigate("hall/create", item ? { item } : null);
  };
  return (
    <SafeAreaView className="p-8 px-4">
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
                  position: "relative",
                }}
                className=" justify-between border-2 border-gray-400 rounded-md"
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
                <View className="relative w-36">
                  <AntDesign
                    name="pluscircle"
                    size={20}
                    color={"blue"}
                    style={{
                      position: "absolute",
                      top: 2,
                      right: 2,
                      zIndex: 100,
                    }}
                    onPress={() => navigateToCreateHall(item)}
                  />
                  <Image
                    source={{
                      uri: item?.images[0]?.uri,
                    }}
                    alt={item?.images[0]?.name as string}
                    className="w-36 h-32 rounded-md object-contain"
                    style={{ maxWidth: columnWidth }}
                  />
                </View>
                <View className="my-2 px-3">
                  <Text>{item.name}</Text>
                  <Text className="">{item.location}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigateToCreateHall()}
        style={{ position: "absolute", bottom: 0, right: 0, left: 0 }}
        className="border-none  rounded-xl p-3 mx-4 flex justify-center items-center bg-blue-800"
      >
        <Text className="text-white">Create New Hall</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HallsScreen;
