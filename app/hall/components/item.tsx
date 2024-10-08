import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Dimensions, Text } from "react-native";
import { IHall } from "../model";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { fetchToken } from "../../../helper";

interface IProps {
  hall: IHall;
  onPress: (hall: IHall) => void;
}
export const HallListItem: React.FC<IProps> = ({ hall, onPress }) => {
  const navigation: any = useNavigation();
  const router = useRouter();
  const date = new Date();
  const [role, setRole] = useState<string>("");
  const lastBooking = hall.bookings.findLast((b) => b);

  const getRole = async () => {
    const role = await fetchToken();
    setRole(role?.role);
    return role;
  };

  useEffect(() => {
    getRole();
  }, []);

  return (
    <View className="w-1/2 p-2">
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            hall.available && role === "admin" ? "CreateHall" : "HallDetail",
            { item: hall }
          )
        }
        className="bg-white flex flex-col justify-between rounded-md shadow-sm border border-gray-300 h-72"
      >
        <View className="relative w-full h-32">
          <Image
            source={{
              uri:
                hall?.images[0]?.uri ||
                "../../../assets/images/adaptive-icon.png",
            }}
            alt={hall?.images[0]?.name || "Hall Image"}
            className="w-full h-32 rounded-t-md object-cover"
          />
        </View>

        <View className="p-3 flex-1">
          <Text className="text-lg text-dark font-bold">{hall?.name}</Text>
          <Text className="text-dark" numberOfLines={1}>
            {hall?.location}
          </Text>
          <Text className="text-dark">{hall.capacity} students</Text>
          <Text
            className={`${hall?.available ? "text-primary" : "text-accent"}`}
          >
            {hall.available ? "Available" : "Booked"}
          </Text>
        </View>

        <View className="p-3">
          {hall.available ||
          (lastBooking &&
            lastBooking.bookedTo &&
            new Date(lastBooking.bookedTo) < date) ? (
            <TouchableOpacity
              className="bg-primary py-2 rounded-md items-center"
              onPress={() =>
                navigation.navigate(
                  hall.available && role === "admin"
                    ? "BookHall"
                    : "HallDetail",
                  {
                    item: hall,
                  }
                )
              }
            >
              <Text className="text-white font-bold">Book Now</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="bg-accent opacity-70 py-2 rounded-md items-center">
              <Text className="text-white font-bold">
                {!hall.available && role === "admin"
                  ? "Already Booked"
                  : "Detail"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
