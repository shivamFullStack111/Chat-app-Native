import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { users } from "../data";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const Home = () => {
  const { allusers } = useSelector((state) => state.user);

  return (
    <View style={{ flex: 1 }}>
      {/* search */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          height: 47,
          borderRadius: 25,
          backgroundColor: "#D9D9D9",
          alignSelf: "center",
          width: "95%",
          marginTop: 15,
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <Feather name="search" size={30} color="#8B868C" />
        <TextInput
          style={{ flex: 1, paddingHorizontal: 10, fontSize: 16 }}
          placeholder="Search..."
        ></TextInput>
      </View>

      <View style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ width: "95%", alignSelf: "center" }}
          data={allusers}
          renderItem={({ item }) => <RenderItem userr={item} />}
        ></FlatList>
      </View>
    </View>
  );
};

export default Home;

const RenderItem = ({ userr }) => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("chatpage", userr)} // sending oponent data
      style={{
        flex: 1,
        display: user?._id == userr?._id ? "none" : null,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginTop: 10,
      }}
    >
      <Image
        width={50}
        height={50}
        style={{ borderRadius: 500 }}
        source={{ uri: userr.image }}
      ></Image>
      <View>
        <Text style={{ fontWeight: "600", color: "#585252" }}>
          {userr.name}
        </Text>
        <Text style={{ color: "#7F7676", fontWeight: "500" }}>
          {userr.lastmessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
