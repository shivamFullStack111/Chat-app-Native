import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setloading] = useState(true);
  const { isauthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isauthenticated) {
      navigation.navigate("tab");
    }
    setloading(false);
  }, [isauthenticated]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const submit = async () => {
    if (!image) {
      alert("Please select an image");
      return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("image", {
      uri: image.uri,
      type: image.mimeType,
      name: image.fileName,
    });

    try {
      const response = await fetch("http://192.168.41.216:9000/register", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert("Registration successful");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      {loading ? (
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={70} />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an image</Text>
          </TouchableOpacity>
          {image && <Image source={{ uri: image.uri }} style={styles.image} />}
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate("login")}>
            already have an account? Login
          </Text>
        </View>
      )}
    </>
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

export default Register;
