import React, { useState } from "react";
import { IProfile } from "./model";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

interface Iprofiletate {
  loading: boolean;
  profile: IProfile;
  getProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const ProfileContext = React.createContext<Iprofiletate>({
  loading: false,
  profile: {} as IProfile,
  getProfile() {
    return null as never;
  },
  logout() {
    return null as never;
  },
});

export const useProfileState = () => {
  const context = React.useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}
export const ProfileContextProvider: React.FC<IProps> = ({ children }) => {
  const navigation: any = useNavigation();
  const [profile, setProfile] = useState<IProfile>({} as IProfile);
  const [loading, setLoading] = useState<boolean>(false);

  const getProfile = async () => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.get(`/profile`);
      setProfile(response.data?.data);
    } catch (error: any) {
      console.log("Error fetching favorites:", error);
      Toast.show(error, {
        textColor: "white",
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const expiredSecret = await AsyncStorage.removeItem("secret");
    const tokenExpiry = await AsyncStorage.removeItem("tokenExpiry");

    navigation.navigate("Login");
  };

  return (
    <ProfileContext.Provider
      value={{
        loading,
        profile,
        getProfile,
        logout,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
