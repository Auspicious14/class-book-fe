import React, { useEffect, useState } from "react";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { IAuthQuery } from "./model";
import { IAuthProps } from "../model";
import { fetchToken } from "../../helper";
import { navigate } from "../navigation";
import { router } from "expo-router";

type RootStackParamList = {
  AdminTabs: undefined;
  ClassRepTabs: undefined;
  StudentTabs: undefined;
  Login: undefined;
  Signup: undefined;
};

interface IAuthState {
  loading: boolean;
  auth: IAuthProps | null;
  isFirstLaunch: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (query: IAuthQuery) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<IAuthState | undefined>(undefined);

export const useAuthState = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used within AuthContextProvider");
  }
  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<IProps> = ({ children }) => {
  const [auth, setAuth] = useState<IAuthProps | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const initializeApp = async () => {
  //     setLoading(true);
  //     try {
  //       const authStatus = await fetchToken();
  //       if (authStatus?.onboardingIncomplete) {
  //         setIsFirstLaunch(true);
  //       } else if (authStatus?.loggedOut) {
  //         setIsFirstLaunch(false);
  //         setAuth(null);
  //       } else if (authStatus?.token) {
  //         setIsFirstLaunch(false);
  //         setAuth({ token: authStatus.token, role: authStatus.role });
  //       }
  //     } catch (error) {
  //       console.error("Error initializing app:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   initializeApp();
  // }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const expirationTime = 7 * 24 * 60 * 60 * 1000;
    const expirationDate = new Date().getTime() + expirationTime;

    try {
      const { api } = await axiosApi();
      const response = await api.post(`/auth/login`, { email, password });
      const data = response.data;
      const role = data.data.role;

      if (response.status === 401) {
        Toast.show(data.message, {
          backgroundColor: "red",
          textColor: "white",
        });
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem(
          "secret",
          JSON.stringify({ token: data.token, role: data.data.role })
        );
        await AsyncStorage.setItem("tokenExpiry", expirationDate.toString());
        setAuth({ token: data.token, role: data.data.role });

        // Uncomment and update navigation logic
        switch (role) {
          case "admin":
            router.replace("/(admin)/home");
            break;
          case "classRep":
            router.replace("/(classRep)/home");
            break;
          case "student":
            router.replace("/(student)/home");
            break;
          default:
            router.replace("/(tabs)/home");
        }
      }
      return role;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred during login";
      console.error("Login error:", error);
      Toast.show(errorMessage, {
        textColor: "white",
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (query: IAuthQuery) => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.post(`/auth/signup`, query);
      const data = response.data;

      if (data) {
        Toast.show(data.message, {
          backgroundColor: "green",
          textColor: "white",
        });
        navigate("Login");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "An error occurred during signup";
      console.error("Signup error:", error);
      Toast.show(errorMessage, {
        textColor: "white",
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("secret");
      await AsyncStorage.removeItem("tokenExpiry");
      setAuth(null);
      navigate("Login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        auth,
        isFirstLaunch,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
