import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall, IHallQuery } from "./model";
import { SearchBar } from "@rneui/themed";
import { useHallState } from "./context";
import { HallListItem } from "./components/item";
import { screenHeight } from "../../constants/utils";
import { router } from "expo-router";

const HallsScreen = () => {
  const { halls, getHalls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>({ name: "" });
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
    router.replace({
      pathname: "hall/create",
      params: item ? JSON.stringify(item) : (undefined as any),
    });
  };

  const filteredHalls = halls?.filter((hall) =>
    hall?.name?.toLowerCase().includes(filter?.name?.toLowerCase() as string)
  );

  return (
    <SafeAreaView className="flex-1 bg-secondary px-4">
      <View className="mt-4">
        <SearchBar
          placeholder="Search for a hall..."
          value={filter?.name || ""}
          onChangeText={(name) => setFilter({ ...filter, name })}
          containerStyle={{
            backgroundColor: "transparent",
            borderWidth: 0,
            paddingHorizontal: 0,
            paddingVertical: 8,
            borderBlockColor: "transparent",
          }}
          inputContainerStyle={{
            backgroundColor: "white",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#e5e7eb",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          inputStyle={{
            color: "#1f2937",
            fontSize: 16,
          }}
          searchIcon={{ name: "search", color: "#6b7280" }}
          clearIcon={{ name: "close", color: "#6b7280" }}
        />
      </View>

      {!loading && filteredHalls?.length > 0 ? (
        <FlatList
          data={filteredHalls}
          style={{ flex: 1 }}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <HallListItem
              hall={item}
              onPress={() => navigateToCreateHall(item)}
            />
          )}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingVertical: 8,
          }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : !loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-dark text-lg font-semibold">
            No halls found
          </Text>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-dark text-lg font-semibold">Loading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HallsScreen;
