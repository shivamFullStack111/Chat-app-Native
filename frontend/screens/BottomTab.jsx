import { View, Text } from "react-native";
import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Home from "./Home";
import Profile from "./Profile";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "./ChatScreen";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTab = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tab" component={Tabbb}></Stack.Screen>
      <Stack.Screen name="chatpage" component={ChatScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default BottomTab;

const Tabbb = () => {
  return (
    <Tab.Navigator labeled={false} activeColor="#000" inactiveColor="#3e2465">
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                <Ionicons name="home-sharp" size={24} color="#EF2278" />
                <Text
                  style={{
                    fontSize: 12,
                    width: 50,
                    alignSelf: "flex-start",
                    fontWeight: "600",
                    color: "#EF2278",
                  }}
                >
                  Home
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="home-outline" size={24} color="black" />
                <Text
                  style={{
                    fontSize: 12,
                    width: 50,
                    alignSelf: "flex-start",
                    fontWeight: "600",
                  }}
                >
                  Home
                </Text>
              </>
            ),
        }}
        name="home"
        component={Home}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <>
                <FontAwesome name="user" size={24} color="#EF2278" />
                <Text
                  style={{
                    fontSize: 12,
                    width: 50,
                    alignSelf: "flex-start",
                    fontWeight: "600",
                    color: "#EF2278",
                  }}
                >
                  Profile
                </Text>
              </>
            ) : (
              <>
                <FontAwesome name="user-o" size={24} color="black" />
                <Text
                  style={{
                    fontSize: 12,
                    width: 50,
                    alignSelf: "flex-start",
                    fontWeight: "600",
                  }}
                >
                  Profile
                </Text>
              </>
            ),
        }}
        name="profile"
        component={Profile}
      />
    </Tab.Navigator>
  );
};
