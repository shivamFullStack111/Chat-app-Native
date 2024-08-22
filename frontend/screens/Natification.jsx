import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { Image } from "react-native";
import { users } from "../data";

const Natification = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            // backgroundColor: "white",
            paddingHorizontal: 10,
            gap: 7,
            marginTop: 10,
          }}
        >
          <Image
            width={50}
            height={50}
            style={{ borderRadius: 500 }}
            source={{ uri: users[0].image }}
          ></Image>
          <View>
            <Text style={{ fontWeight: "600", color: "#585252" }}>
              karan singh
            </Text>
            <Text style={{ color: "#7F7676", fontWeight: "500" }}>
              send you friend request
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginLeft: "auto",
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor: "#4e58de",
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white" }}>Accept</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Natification;
