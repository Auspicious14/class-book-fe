import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, Image } from "react-native";
import { IHall } from "../hall/model";
import { Link, useRouter } from "expo-router";
import { fetchToken } from "../../helper";
import { useNavigation } from "@react-navigation/native";
import { CustomText } from "../../components";

interface IProps {
  halls: IHall[];
  loading: boolean;
}
const AvailableHalls: React.FC<IProps> = ({ loading, halls }) => {
  const navigation: any = useNavigation();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const authStatus = async () => {
      const auth = await fetchToken();
      setRole(auth?.role);
    };
    authStatus();
  }, []);

  return (
    <View>
      <CustomText className="font-bold text-dark text-lg">
        Available Halls for you
      </CustomText>
      {!loading && halls?.length > 0 && (
        <View className="py-4">
          <FlatList
            data={halls}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View className="mr-4 w-64">
                {/* Card Container */}
                <View className="bg-white flex flex-col justify-between rounded-xl shadow-sm border border-gray-200 h-72 p-3">
                  {/* Image Section */}
                  <View className="relative w-full h-32">
                    <Image
                      source={{
                        uri:
                          item?.images[0]?.uri ||
                          "../../assets/images/adaptive-icon.png",
                      }}
                      alt={item?.images[0]?.name || "Hall Image"}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </View>

                  {/* CustomText Section */}
                  <View className="flex-1 mt-2">
                    <View className="flex flex-row justify-between items-center">
                      <CustomText className="text-lg text-dark font-semibold">
                        {item?.name}
                      </CustomText>
                      <CustomText
                        className={`${
                          item?.available ? "text-primary" : "text-accent"
                        } font-medium`}
                      >
                        {item.available ? "Available" : "Booked"}
                      </CustomText>
                    </View>
                    <CustomText
                      className="text-gray-500 text-sm mt-1"
                      numberOfLines={1}
                    >
                      {item?.location}
                    </CustomText>
                    <CustomText className="text-dark text-sm mt-1">
                      {item.capacity} students
                    </CustomText>
                  </View>

                  {/* Button Section */}
                  <View className="mt-3">
                    <Link
                      href={{
                        pathname:
                          item.available && role !== "student"
                            ? "/hall/booking"
                            : "/hall/detail",
                        params: {
                          hallData: JSON.stringify(item),
                        },
                      }}
                      asChild
                    >
                      <TouchableOpacity
                        className={`${
                          item.available && role !== "student"
                            ? "bg-primary"
                            : "bg-accent opacity-70"
                        } py-2 rounded-md items-center`}
                      >
                        <CustomText className="text-white font-semibold">
                          {item.available && role !== "student"
                            ? "Book Now"
                            : "Detail"}
                        </CustomText>
                      </TouchableOpacity>
                    </Link>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AvailableHalls;
