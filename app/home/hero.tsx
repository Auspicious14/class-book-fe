import React from "react";
import { Dimensions, Image, ImageBackground, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const items = [
  {
    name: "",
    image: "/assets/images/Checklist-pana.png",
  },
  {
    name: "",
    image: "/assets/images/Hotel Booking-pana.png",
  },
  {
    name: "",
    image: "/assets/images/Schedule-amico.png",
  },
];
export const HeroCarousel = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="h-40 my-4">
      <Carousel
        loop
        autoPlay
        width={screenWidth}
        height={screenWidth / 2}
        scrollAnimationDuration={1000}
        data={items}
        renderItem={({ item, index }) => (
          <View key={index} className="w-full h-40">
            <Image
              source={{ uri: item.image }}
              width={screenWidth}
              height={400}
              className="w-full h-40"
            />
          </View>
        )}
      />
    </View>
  );
};
