import React, { useState } from "react";
import { IBookQuery, IHall, IHallQuery, IImage } from "./model";
import { axiosApi } from "../../components/api";
import Toast from "react-native-root-toast";

interface IHallState {
  loading: boolean;
  halls: IHall[];
  hall: IHall;
  getHalls: (payload?: IHallQuery) => Promise<void>;
  getOneHall: (id: string) => Promise<any>;
  saveHall: (query: IHall, image: IImage) => Promise<any>;
  bookHall: (hallId: string, query: IBookQuery) => Promise<any>;
  checkHallValidity: (hallId: string, hallData: any) => void;
}

const HallConext = React.createContext<IHallState>({
  loading: false,
  hall: {} as IHall,
  halls: [],
  getHalls() {
    return null as never;
  },
  getOneHall(id) {
    return null as never;
  },
  saveHall(query, image) {
    return null as never;
  },
  bookHall(hallId, query) {
    return null as never;
  },
  checkHallValidity(hallId, hallData) {},
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
  const [hall, setHall] = useState<IHall>({} as IHall);
  const [loading, setLoading] = useState<boolean>(false);

  const getHalls = async (payload?: IHallQuery) => {
    setLoading(true);
    const query = new URLSearchParams(payload as any).toString();
    try {
      const { api } = await axiosApi();
      const response = await api.get(`/halls?${query}`);
      setHalls(response.data?.data);
    } catch (error: any) {
      Toast.show(error, {
        textColor: "white",
        backgroundColor: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const getOneHall = async (id: string) => {
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const response = await api.get(`/hall/${id}`);
      setHall(response.data?.data);
    } catch (error: any) {
      Toast.show(error, {
        textColor: "white",
        backgroundColor: "red",
      });
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

  const bookHall = async (hallId: string, query: IBookQuery) => {
    const { duration, ...vals } = query;
    setLoading(true);
    try {
      const { api } = await axiosApi();
      const res = await api.post(`/book/hall`, {
        hallId,
        duration: parseFloat(query.duration),
        ...vals,
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

  const checkHallValidity = (hallId: string, hallData: any) => {
    setHalls((prevHalls) =>
      prevHalls.map((hall) => (hall._id === hallId ? hallData : hall))
    );
  };

  return (
    <HallConext.Provider
      value={{
        loading,
        halls,
        hall,
        getHalls,
        getOneHall,
        saveHall,
        bookHall,
        checkHallValidity,
      }}
    >
      {children}
    </HallConext.Provider>
  );
};
