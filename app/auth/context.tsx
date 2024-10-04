import React, { useState } from "react";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { IAuthQuery } from "./model";

interface IAuthState {
  loading: boolean;
  Login: (email: string, password: string) => Promise<void>;
  Signup: (query: IAuthQuery) => Promise<void>;
}

const AuthContext = React.createContext<IAuthState>({
  loading: false,
  Login(email, password) {
    return null as never;
  },
  Signup(query) {
    return null as any;
  },
});

export const useAuthState = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation: any = useNavigation();

  const Login = async (email: string, password: string) => {
    const expirationTime = 7 * 24 * 60 * 60 * 1000;
    const expirationDate = new Date().getTime() + expirationTime;

    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.post(`/auth/signup`, { email, password });
      const data = await response.data;

      if (data.message) {
        Toast.show(data?.message, {
          backgroundColor: "green",
          textColor: "white",
        });
      }

      if (data.token) {
        await AsyncStorage.setItem(
          "secret",
          JSON.stringify({
            token: data.token,
            role: data?.data?.role,
          })
        );
        await AsyncStorage.setItem("tokenExpiry", expirationDate.toString());
        navigation.navigate("HallPage");
      }
    } catch (error: any) {
      Toast.show(error, {
        textColor: "white",
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const Signup = async (query: IAuthQuery) => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.post(`/auth/login`, query);

      const data = response.data;
      if (data) {
        Toast.show(data.message, {
          backgroundColor: "green",
          textColor: "white",
        });
        navigation.navigate("Login");
      }
    } catch (error: any) {
      setLoading(false);
      Toast.show(error?.message, {
        backgroundColor: "red",
        textColor: "white",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        Login,
        Signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
