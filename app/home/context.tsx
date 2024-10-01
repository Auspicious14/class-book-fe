import React, { useState } from "react";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";

interface HomeState {
  loading: boolean;
  addPushTokenToUser: (userId: string, pushToken: string) => Promise<any>;
}

const HomeContext = React.createContext<HomeState>({
  loading: false,
  addPushTokenToUser(userId, pushToken) {
    return null as never;
  },
});

export const useHomeState = () => {
  const context = React.useContext(HomeContext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}
export const HomeContextProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const addPushTokenToUser = async (userId: string, pushToken: string) => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const res = await api.put(`/notification/save`, {
        userId,
        pushToken,
      });

      Toast.show(res?.data.message, {
        backgroundColor: "green",
        textColor: "white",
      });

      return res?.data;
    } catch (error: any) {
      setLoading(false);
      Toast.show(error.response.data, {
        backgroundColor: "red",
        textColor: "white",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeContext.Provider
      value={{
        loading,
        addPushTokenToUser,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
