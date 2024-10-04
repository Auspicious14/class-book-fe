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
import { screenHeight } from "../../constants/utils";

const numColumns = 2;

const HallsScreen = () => {
  const { halls, getHalls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>();
  const navigation: any = useNavigation();

  useEffect(() => {
    getHalls(filter);
    StatusBar.setBarStyle("light-content");
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
      className=" px-4 bg-secondary my-0"
      // style={{ marginTop: -10 }}
    >
      <View>
        {/* <Text className="text-xl font-bold text-center text-dark">
          Available Lecture Halls
        </Text> */}
        <SearchBar
          placeholder="Search for a hall..."
          lightTheme
          className="rounded-lg border-primary border"
          containerStyle={{
            backgroundColor: "transparent",
            borderBlockColor: "transparent",
            padding: 0,
          }}
          inputContainerStyle={{
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderWidth: 1,
          }}
          value={filter?.name}
          onChangeText={(name) => setFilter({ ...filter, name })}
          // onChange={(e) => setFilter({...filter, name: e.target.})}
        />
      </View>
      {/* {loading && <Text>Loading...</Text>} */}
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
