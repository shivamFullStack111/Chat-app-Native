import React, { useContext, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import ChatScreen from "./screens/ChatScreen";
import { TouchableOpacity } from "react-native";
import Natification from "./screens/Natification";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Register from "./screens/Register";
import Login from "./screens/Login";
import {
  setactiveusers,
  setallusers,
  setiasauthenticated,
  setuser,
} from "./store/slices/userSlice";
import { SocketContext, SocketProvider } from "./screens/SocketContext";

const Stack = createStackNavigator();

const Main = () => {
  const dispatch = useDispatch();
  const { isauthenticated } = useSelector((state) => state.user);

  const { socket } = useContext(SocketContext);
  const { user } = useSelector((s) => s.user);

  useEffect(() => {
    const handleActiveUsers = (activeUsers) => {
      dispatch(setactiveusers(activeUsers));
      activeUsers?.map((user) =>
        console.log(
          user.email,
          "..............................................................................................................................................................................................................................."
        )
      );
    };

    socket.on("activeUsers", handleActiveUsers);

    return () => {
      socket.off("activeUsers", handleActiveUsers);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("add-me", user);
    }
  }, [socket, user]);

  useEffect(() => {
    const getUsers = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://192.168.41.216:9000/get-all-users");
        dispatch(setallusers(res.data.users || []));
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const cheack_authentication = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axios.get("http://192.168.41.216:9000/get-user", {
          headers: { Authorization: token },
        });
        if (res.data.success) {
          dispatch(setiasauthenticated(true));
          dispatch(setuser(res.data.user));
        }
      }
    };
    cheack_authentication();
  }, []);

  return (
    <NavigationContainer>
      {isauthenticated ? (
        <Stack.Navigator>
          <Stack.Screen
            options={({ navigation }) => ({
              title: "Chatly",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("notification")}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                    position: "relative",
                  }}
                >
                  <FontAwesome name="bell-o" size={24} color="black" />
                  <Text
                    style={{
                      position: "absolute",
                      backgroundColor: "#34E414",
                      height: 19,
                      width: 19,
                      borderRadius: 30,
                      textAlign: "center",
                      textAlignVertical: "center",
                      color: "white",
                      top: -8,
                      right: -4,
                    }}
                  >
                    2
                  </Text>
                </TouchableOpacity>
              ),
            })}
            name="tab"
            component={Tabbb}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="chatpage"
            component={ChatScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="notification"
            component={Natification}
          ></Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="login"
            component={Login}
          />

          <Stack.Screen
            options={{ headerShown: false }}
            name="register"
            component={Register}
          />

          <Stack.Screen
            options={({ navigation }) => ({
              title: "Chatly",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("notification")}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                    position: "relative",
                  }}
                >
                  <FontAwesome name="bell-o" size={24} color="black" />
                  <Text
                    style={{
                      position: "absolute",
                      backgroundColor: "#34E414",
                      height: 19,
                      width: 19,
                      borderRadius: 30,
                      textAlign: "center",
                      textAlignVertical: "center",
                      color: "white",
                      top: -8,
                      right: -4,
                    }}
                  >
                    2
                  </Text>
                </TouchableOpacity>
              ),
            })}
            name="tab"
            component={Tabbb}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="chatpage"
            component={ChatScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="notification"
            component={Natification}
          ></Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const Tab = createMaterialBottomTabNavigator();

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

const App = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <Main />
      </SocketProvider>
    </Provider>
  );
};
export default App;
