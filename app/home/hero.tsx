import React from "react";
import { Dimensions, Image, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const items = [
  {
    image: require("../../assets/images/Checklist-pana.png"),
  },
  {
    image: require("../../assets/images/Hotel Booking-pana.png"),
  },
  {
    image: require("../../assets/images/Schedule-amico.png"),
  },
];

const HeroCarousel = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="h-40 my-4 mb-10">
      <Carousel
        loop
        autoPlay
        width={screenWidth}
        height={screenWidth / 2}
        scrollAnimationDuration={1000}
        data={items}
        renderItem={({ item, index }) => (
          <View key={index} className="w-full h-full">
            <Image
              source={item.image}
              width={screenWidth}
              height={400}
              className="w-full h-full rounded-2xl"
            />
          </View>
        )}
      />
    </View>
  );
};

export default HeroCarousel;
