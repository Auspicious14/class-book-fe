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
    baseURL: "http://192.168.210.114:2000",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return {
    api,
  };
};
