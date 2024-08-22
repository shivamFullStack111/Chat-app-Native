import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setiasauthenticated, setuser } from "../store/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submit = async () => {
    try {
      const res = await axios.post("http://192.168.41.216:9000/login", {
        email,
        password,
      });

      const result = res.data;

      if (result.success) {
        alert("Login successful");
        await AsyncStorage.setItem("token", result.token);
        dispatch(setiasauthenticated(true));
        dispatch(setuser(result.user));
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(pass) => setPassword(pass)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={submit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("register")}>
        Not have an account? Register
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#007BFF",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default Login;
