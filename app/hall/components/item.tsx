import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Dimensions, Text } from "react-native";
import { IHall } from "../model";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
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

  const isBookable =
    hall.available ||
    (lastBooking &&
      lastBooking.bookedTo &&
      new Date(lastBooking.bookedTo) < date);

  return (
    <View className="w-1/2 p-2">
      <View className="bg-white flex flex-col justify-between rounded-xl shadow-sm border border-gray-200 h-76 p-3">
        <View className="relative w-full h-32">
          <Image
            source={{
              uri:
                hall?.images[0]?.uri ||
                "../../../assets/images/adaptive-icon.png",
            }}
            alt={hall?.images[0]?.name || "Hall Image"}
            className="w-full h-full rounded-lg object-cover"
          />
        </View>

        <View className="flex-1 mt-2">
          <Text className="text-lg text-dark font-semibold">{hall?.name}</Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {hall?.location}
          </Text>
          <Text className="text-dark text-sm mt-1">
            {hall?.capacity} students
          </Text>
          <Text
            className={`${
              hall?.available ? "text-primary" : "text-accent"
            } font-medium mt-1`}
          >
            {hall.available ? "Available" : "Booked"}
          </Text>
        </View>

        {/* Button Section */}
        <View className="mt-3">
          {isBookable ? (
            <Link
              href={{
                pathname:
                  hall.available && role === "admin"
                    ? "/hall/create"
                    : "/hall/detail",
                params: {
                  hallData: JSON.stringify(hall),
                },
              }}
              asChild
            >
              <TouchableOpacity className="bg-primary py-2 rounded-md items-center">
                <Text className="text-white font-semibold">Book Now</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Link
              href={{
                pathname: "/hall/detail",
                params: {
                  hallData: JSON.stringify(hall),
                },
              }}
              asChild
            >
              <TouchableOpacity
                className={`${
                  !hall.available && role === "admin"
                    ? "bg-gray-400"
                    : "bg-accent opacity-70"
                } py-2 rounded-md items-center`}
                disabled={role === "admin" && !hall.available}
              >
                <Text className="text-white font-semibold">
                  {!hall.available && role === "admin"
                    ? "Already Booked"
                    : "Detail"}
                </Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </View>
  );
};
