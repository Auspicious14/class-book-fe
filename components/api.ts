import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const axiosApi = async () => {
  let token: any;
  const storedToken = await AsyncStorage.getItem("secret");
  if (storedToken) {
    const extractToken = JSON.parse(storedToken);
    token = extractToken.token;
  }
  const api = axios.create({
    // baseURL: process.env.EXPO_PUBLIC_API_URL,
    baseURL: "http://192.168.42.5:10000",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    api,
  };
};
