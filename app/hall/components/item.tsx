import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Image, Dimensions } from "react-native";
import { IHall } from "../model";
import { useNavigation } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { fetchToken } from "../../../helper";
import { CustomText } from "../../../components";

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
      <TouchableOpacity
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        onPress={() => onPress(hall)}
      >
        <View className="w-full h-36">
          <Image
            source={{
              uri: hall?.images[0]?.uri || "https://via.placeholder.com/150", // Fallback image
            }}
            className="w-full h-full object-cover"
          />
          <View className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-sm">
            <CustomText
              className={`text-xs font-semibold ${
                hall.available ? "text-primary" : "text-accent"
              }`}
            >
              {hall.available ? "Available" : "Booked"}
            </CustomText>
          </View>
        </View>

        <View className="p-3">
          <CustomText
            className="text-dark text-lg font-semibold"
            numberOfLines={1}
          >
            {hall?.name}
          </CustomText>
          <CustomText className="text-gray-500 text-sm mt-1" numberOfLines={1}>
            {hall?.location || "Unknown Location"}
          </CustomText>
          <CustomText className="text-dark text-sm mt-1">
            {hall?.capacity} students
          </CustomText>

          <Link
            href={{
              pathname:
                isBookable && role === "admin"
                  ? "/hall/create"
                  : "/hall/detail",
              params: { hallData: JSON.stringify(hall) },
            }}
            asChild
          >
            <TouchableOpacity
              className={`mt-3 py-2 rounded-md items-center ${
                isBookable
                  ? "bg-primary"
                  : role === "admin"
                  ? "bg-gray-400"
                  : "bg-accent opacity-70"
              }`}
              disabled={!isBookable && role === "admin"}
            >
              <CustomText className="text-white text-sm font-semibold">
                {isBookable && role === "admin"
                  ? "Update Hall"
                  : isBookable
                  ? "Book Now"
                  : role === "admin"
                  ? "Already Booked"
                  : "View Details"}
              </CustomText>
            </TouchableOpacity>
          </Link>
        </View>
      </TouchableOpacity>
    </View>
  );
};
