import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall, IHallQuery } from "./model";
import { SearchBar } from "@rneui/themed";
import { useHallState } from "./context";
import { HallListItem } from "./components/item";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HallsScreen = () => {
  const { halls, getHalls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>();
  const navigation: any = useNavigation();

  useEffect(() => {
    getHalls(filter);
  }, [filter]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#9C27B0"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }
  const navigateToCreateHall = (item?: IHall) => {
    navigation.navigate("hall/create", item ? { item } : null);
  };

  return (
    <SafeAreaView
      className=" px-4 bg-secondary"
      style={{ marginTop: StatusBar.currentHeight || 0 }}
    >
      <View>
        <Text className="text-xl font-bold text-center text-dark">
          Available Lecture Halls
        </Text>
        <SearchBar
          placeholder="Search for a hall..."
          lightTheme
          className="rounded-lg "
          onChangeText={(name) => setFilter({ ...filter, name })}
        />
      </View>
      {loading && <Text>Loading...</Text>}
      {!loading && halls.length > 0 && (
        <View className="">
          <FlatList
            data={halls}
            style={{ height: screenHeight - 150 }}
            numColumns={2}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <HallListItem
                hall={item}
                onPress={() => navigateToCreateHall(item)}
              />
            )}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />
        </View>
      )}
      {/* <TouchableOpacity
        onPress={() => navigateToCreateHall()}
        style={{ position: "absolute", bottom: 2, right: 0, left: 0 }}
        className="border-none  rounded-xl p-3 mx-4 flex justify-center items-center bg-blue-800"
      >
        <Text className="text-white">Create New Hall</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default HallsScreen;
