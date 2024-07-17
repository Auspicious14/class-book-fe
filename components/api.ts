import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const axiosApi = async () => {
  const token = await AsyncStorage.getItem("token");

  const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    api,
  };
};
