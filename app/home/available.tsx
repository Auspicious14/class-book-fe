import React from "react";
import { FlatList, TouchableOpacity, View, Text, Image } from "react-native";
import { IHall } from "../hall/model";
import { useNavigation } from "expo-router";

interface IProps {
  halls: IHall[];
  loading: boolean;
}
export const AvailableHalls: React.FC<IProps> = ({ loading, halls }) => {
  const navigation: any = useNavigation();
  const date = new Date();
  const lastBooking = (item: IHall) => {
    const lastBooking = item.bookings.findLast((b) => b);
    return lastBooking;
  };
  return (
    <View>
      <Text className="font-bold text-dark text-lg">
        Available Halls for you
      </Text>
      {!loading && halls.length > 0 && (
        <View className="py-4">
          <FlatList
            data={halls}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View className="mr-4 w-64">
                <TouchableOpacity
                  onPress={() => {}}
                  className="bg-white flex flex-col justify-between rounded-md shadow-sm border border-gray-300 h-72"
                >
                  <View className="relative w-full h-32">
                    <Image
                      source={{
                        uri:
                          item?.images[0]?.uri ||
                          "../../assets/images/adaptive-icon.png",
                      }}
                      alt={item?.images[0]?.name || "Hall Image"}
                      className="w-full h-32 rounded-t-md object-cover"
                    />
                  </View>

                  <View className="p-3 flex-1">
                    <View className="flex flex-row justify-between items-center">
                      <Text className="text-lg text-dark font-bold">
                        {item?.name}
                      </Text>
                      <Text
                        className={`${
                          item?.available ? "text-primary" : "text-accent"
                        }`}
                      >
                        {item.available ? "Available" : "Booked"}
                      </Text>
                    </View>
                    <Text className="text-gray-500" numberOfLines={1}>
                      {item?.location}
                    </Text>
                    <Text className="text-dark">{item.capacity} students</Text>
                  </View>

                  <View className="p-3">
                    {item.available && (
                      <TouchableOpacity
                        className="bg-primary py-2 rounded-md items-center"
                        onPress={() =>
                          navigation.navigate("item/booking", {
                            item,
                          })
                        }
                      >
                        <Text className="text-white font-bold">Book Now</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};
