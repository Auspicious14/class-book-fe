import React, { useState } from "react";
import { IHall } from "./model";
import { axiosApi } from "../../components/api";

interface IHallState {
  loading: boolean;
  halls: IHall[];
  getHalls: () => Promise<void>;
}

const HallConext = React.createContext<IHallState>({
  loading: false,
  halls: [],
  getHalls() {
    return null as never;
  },
});

export const useHallState = () => {
  const context = React.useContext(HallConext);
  if (context === undefined) {
    throw new Error("app dispatch must be used within app global provider");
  }

  return context;
};

interface IProps {
  children: React.ReactNode;
}
export const HallConextProvider: React.FC<IProps> = ({ children }) => {
  const [halls, setHalls] = useState<IHall[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getHalls = async () => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.get("/halls");
      setHalls(response.data?.data);
    } catch (error: any) {
      console.log("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HallConext.Provider
      value={{
        loading,
        halls,
        getHalls,
      }}
    >
      {children}
    </HallConext.Provider>
  );
};
