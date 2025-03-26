import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { IHall, IHallQuery } from "./model";
import { SearchBar } from "@rneui/themed";
import { useHallState } from "./context";
import { HallListItem } from "./components/item";
import { screenHeight } from "../../constants/utils";
import { router } from "expo-router";
import { CustomText } from "../../components";
import { TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { fetchToken } from "../../helper";

const HallsScreen = () => {
  const { halls, getHalls, loading } = useHallState();
  const [filter, setFilter] = useState<IHallQuery>({ name: "" });
  const navigation: any = useNavigation();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    getHalls(filter);
    StatusBar.setBarStyle("light-content");
  }, [filter]);

  const getRole = async () => {
    const role = await fetchToken();
    setRole(role?.role);
    return role;
  };

  useEffect(() => {
    getRole();
  }, []);

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
      pathname: role === "admin" ? "hall/create" : "hall/detail",
      params: item ? JSON.stringify(item) : (undefined as any),
    });
  };

  const filteredHalls = halls?.filter((hall) =>
    hall?.name?.toLowerCase().includes(filter?.name?.toLowerCase() as string)
  );

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <LinearGradient
        colors={["#4CAF50", "#6b7280"]}
        className="pt-12 pb-6 px-4 h-40"
      >
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl border border-gray-200 shadow-sm">
          <Feather name="search" size={20} color="#6b7280" className="ml-3" />
          <TextInput
            placeholder="Search for a hall..."
            value={filter?.name || ""}
            onChangeText={(name) => setFilter({ ...filter, name })}
            className="flex-1 p-3 text-dark text-base"
            placeholderTextColor="#6b7280"
            autoCapitalize="none"
          />
          {filter?.name && (
            <TouchableOpacity
              onPress={() => setFilter({ ...filter, name: "" })}
              className="mr-3"
            >
              <Feather name="x" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Hall List */}
      <View className="flex-1 px-4 -mt-4">
        {!loading && filteredHalls?.length > 0 ? (
          <FlatList
            data={filteredHalls}
            numColumns={2}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <HallListItem hall={item} onPress={navigateToCreateHall} />
            )}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingVertical: 8,
            }}
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />
        ) : !loading ? (
          <View className="flex-1 justify-center items-center">
            <CustomText className="text-dark text-lg font-semibold">
              No halls found
            </CustomText>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center">
            <CustomText className="text-dark text-lg font-semibold">
              Loading...
            </CustomText>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HallsScreen;
