import React, { useState } from "react";
import { IHall, IImage } from "./model";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";

interface IHallState {
  loading: boolean;
  halls: IHall[];
  getHalls: () => Promise<void>;
  saveHall: (query: IHall, image: IImage) => Promise<any>;
}

const HallConext = React.createContext<IHallState>({
  loading: false,
  halls: [],
  getHalls() {
    return null as never;
  },
  saveHall(query, image) {
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

  const saveHall = async (query: IHall, image: IImage) => {
    const { _id, images, ...vals } = query;
    setLoading(true);
    try {
      const { api } = await axiosApi();
      let response;
      if (_id) {
        console.log(query, "queryy");
        response = await api.put("/update/hall", {
          ...vals,
          _id,
          files: [image],
        });
      } else {
        response = await api.post("/create/hall", {
          ...vals,
          files: [image],
        });
      }
      const data = await response.data;
      if (data.message) {
        Toast.show(data?.message, {
          backgroundColor: "green",
          textColor: "white",
        });
      }

      if (data.error) {
        Toast.show(data.error, {
          backgroundColor: "red",
          textColor: "white",
        });
      }
      return data.data;
    } catch (error: any) {
      Toast.show(error?.message, {
        backgroundColor: "red",
        textColor: "white",
      });
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
        saveHall,
      }}
    >
      {children}
    </HallConext.Provider>
  );
};
