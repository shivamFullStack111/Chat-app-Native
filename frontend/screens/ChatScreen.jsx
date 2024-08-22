import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Feather,
  Entypo,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SocketContext } from "./SocketContext";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import AudioRecordAndPlay from "./AudioRecordAndPlay";
import CameraClicker from "./CameraClicker";

const ChatScreen = (props) => {
  const { width } = Dimensions.get("window");
  const oponentUser = props.route.params;
  const { user } = useSelector((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [active, setActive] = useState(false);
  const { activeusers } = useSelector((state) => state.user);
  const { socket } = useContext(SocketContext);
  const scrollviewRef = useRef();
  const [cameraData, setcameraData] = useState({
    type: "image",
    isRecording: false,
    uri: "",
    name: `${Date.now() + "478634hehf_video.mp4"}`,
    modalOpen: false,
  });

  const sendRecordVideo = async (uri) => {
    try {
      const newMEssage = {
        members: [oponentUser?._id, user?._id],
        sender: user,
        receiver: oponentUser,
        messageType: "video",
        url: uri,
      };

      console.log(cameraData.uri);
      // setMessages((prev) => [...prev, newMEssage]);

      const token = await AsyncStorage.getItem("token");
      if (token) {
        const formdata = new FormData();
        formdata.append("members", JSON.stringify(newMEssage.members));
        formdata.append("sender", JSON.stringify(newMEssage.sender));
        formdata.append("receiver", JSON.stringify(newMEssage.receiver));
        formdata.append("messageType", "imageVideo");
        formdata.append("image", {
          name: `${Date.now() + "478634hehf_video.mp4"}`,
          type: "video/mp4",
          uri: uri,
        });
        const res = await axios.post(
          "http://192.168.41.216:9000/send-message",
          formdata,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response:" + res.message);
      }

      setcameraData((pre) => ({ ...pre, modalOpen: false }));
      setcameraData({
        type: "image",
        isRecording: false,
        uri: "",
        name: `${Date.now() + "478634hehf_video.mp4"}` + Math.random() * 1000,
        modalOpen: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendAudio = async (audiouri) => {
    try {
      console.log("audio done: " + audiouri);

      const newMessage = {
        members: [user?._id, oponentUser?._id],
        sender: user,
        receiver: oponentUser,
        messageType: "audio",
        url: audiouri,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const formdata = new FormData();
      formdata.append("newMessage", JSON.stringify(newMessage));
      formdata.append("image", {
        uri: audiouri, // Ensure this is correct and accessible
        type: "audio/m4a", // Correct MIME type
        name: Date.now() + "audio-recording.m4a", // Ensure the name has an extension
      });

      const token = await AsyncStorage.getItem("token");

      if (token) {
        console.log("Token found:", token);

        try {
          const res = await axios.post(
            "http://192.168.41.216:9000/send-audio",
            formdata,
            {
              headers: {
                Authorization: token, // Ensure the token is correctly formatted
                "Content-Type": "multipart/form-data",
              },
            }
          );
          console.log("Response data:", res.data);
        } catch (axiosError) {
          if (axiosError.response) {
            // Server responded with a status other than 2xx
            console.log("Axios error response data:", axiosError.response.data);
            console.log(
              "Axios error response status:",
              axiosError.response.status
            );
            console.log(
              "Axios error response headers:",
              axiosError.response.headers
            );
          } else if (axiosError.request) {
            // Request was made but no response received
            console.log("Axios error request:", axiosError.request);
          } else {
            // Something else happened
            console.log("Axios error message:", axiosError.message);
          }
        }
      } else {
        alert("Please log in to send audio");
      }
    } catch (error) {
      console.log("General error:", error);
    }
  };

  const sendCaptureImage = async (uri) => {
    try {
      const newMEssage = {
        members: [oponentUser?._id, user?._id],
        sender: user,
        receiver: oponentUser,
        messageType: "image",
        url: uri,
      };

      console.log(cameraData.uri);
      // setMessages((prev) => [...prev, newMEssage]);

      const token = await AsyncStorage.getItem("token");
      if (token) {
        const formdata = new FormData();
        formdata.append("members", JSON.stringify(newMEssage.members));
        formdata.append("sender", JSON.stringify(newMEssage.sender));
        formdata.append("receiver", JSON.stringify(newMEssage.receiver));
        formdata.append("messageType", "imageVideo");
        formdata.append("image", {
          name: `${Date.now() + "478634hehf_video.mp4"}`,
          type: "image/png",
          uri: uri,
        });
        const res = await axios.post(
          "http://192.168.41.216:9000/send-message",
          formdata,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response:" + res.message);
      }

      setcameraData((pre) => ({ ...pre, modalOpen: false }));
      setcameraData({
        type: "image",
        isRecording: false,
        uri: "",
        name: `${Date.now() + "478634hehf_video.mp4"}` + Math.random() * 1000,
        modalOpen: false,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const [imageOrVideo, setImageOrVideo] = useState([]);

  useEffect(() => {
    socket.on("newMessage", (msage) => {
      if (msage.sender?._id !== user?._id) {
        setMessages((prevMessages) => [...prevMessages, msage]);
      }
    });
    socket.on("videoImageMessage", (newMessage) => {
      console.log(
        newMessage +
          "................................................................................................."
      );
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, [socket]);

  // scroll to botoom
  useEffect(() => {
    scrollToBotom();
  }, []);

  const scrollToBotom = () => {
    scrollviewRef.current.scrollToEnd({ animated: true });
  };

  const handleSendMessage = async () => {
    try {
      const message = {
        members: [user?._id, oponentUser?._id],
        sender: user,
        receiver: oponentUser,
        messageType: "text",
        text,
      };

      const token = await AsyncStorage.getItem("token");
      if (token) {
        const res = await axios.post(
          "http://192.168.41.216:9000/send-message",
          message,
          {
            headers: { Authorization: token },
          }
        );
        if (res.data.success) {
          socket.emit("message", message);
          console.log("emit done............................................");
          setMessages((prevMessages) => [...prevMessages, message]);
          setText("");
        } else {
          alert(res.data.message);
        }
      } else {
        alert("please login to continue");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSendVideoImage = async () => {
    try {
      const formData = new FormData();
      formData.append("members", JSON.stringify([user?._id, oponentUser?._id]));
      formData.append("sender", JSON.stringify(user));
      formData.append("receiver", JSON.stringify(oponentUser));
      formData.append("messageType", "imageVideo");

      imageOrVideo.forEach((file, index) => {
        formData.append("image", {
          uri: file.uri,
          type: file.mimeType,
          name: file.fileName,
        });
      });

      console.log(imageOrVideo);
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const res = await axios.post(
          "http://192.168.41.216:9000/send-message",
          formData,
          {
            headers: {
              Authorization: token,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Response:", res.data);
        setImageOrVideo([]);
      } else {
        alert("Please login to continue");
      }
    } catch (error) {
      console.log("Error in sending video image function:", error.message);
    }
  };

  useEffect(() => {
    if (user && oponentUser) {
      getMessage();
    }
  }, [user, oponentUser]);

  const getMessage = async () => {
    const res = await axios.post("http://192.168.41.216:9000/get-messages", {
      user1: user?._id,
      user2: oponentUser?._id,
    });
    setMessages(res.data.messages || []);
  };

  useEffect(() => {
    if (!activeusers.length) return;
    const isactive = activeusers.find((user) => user?._id == oponentUser?._id);
    if (isactive) setActive(true);
    else setActive(false);
  }, [oponentUser, activeusers]);

  const handleVideoAndPhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        setImageOrVideo([...result.assets]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        visible={imageOrVideo.length > 0}
        style={{ backgroundColor: "transparent" }}
        animationType="slide"
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: "#000000aa" }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  padding: 20,
                }}
              >
                <Entypo
                  name="circle-with-cross"
                  size={30}
                  color="white"
                  onPress={() => setImageOrVideo([])}
                />
              </View>
              {imageOrVideo?.map((data, i) => {
                let type = data.mimeType.split("/")[0];
                console.log(type);
                return (
                  <View key={i}>
                    {type === "image" && (
                      <View style={{ marginBottom: 20 }}>
                        <Image
                          style={{ height: 300, width: 300, borderRadius: 20 }}
                          source={{ uri: data.uri }}
                        />
                      </View>
                    )}
                    {type === "video" && (
                      <Video
                        key={i}
                        style={{ height: 300, width: 300, borderRadius: 10 }}
                        useNativeControls
                        source={{ uri: data.uri }}
                        resizeMode="contain"
                        shouldPlay
                      />
                    )}
                  </View>
                );
              })}
              <View>
                <MaterialCommunityIcons
                  onPress={handleSendVideoImage}
                  name="send-circle"
                  size={50}
                  color="white"
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal animationType="fade" visible={cameraData.modalOpen}>
        <CameraClicker
          sendCaptureImage={sendCaptureImage}
          sendRecordVideo={sendRecordVideo}
          setcameraData={setcameraData}
          cameraData={cameraData}
        ></CameraClicker>
      </Modal>

      {/* header */}
      <SafeAreaView>
        <View
          style={{
            width: "100%",
            height: 60,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            paddingHorizontal: 10,
            borderColor: "#CBCBCB",
            backgroundColor: "#DCD8D8",
          }}
        >
          <Feather
            onPress={() => props.navigation.goBack()}
            name="arrow-left"
            size={24}
            color="black"
          />
          <Image
            style={{
              width: 45,
              marginLeft: 5,
              height: 45,
              borderRadius: 100,
              objectFit: "constain",
            }}
            source={{ uri: oponentUser.image }}
          />
          <View>
            <Text style={{ fontWeight: "600" }}>{oponentUser.name}</Text>
            <Text style={{ fontWeight: "500", fontSize: 12, color: "#05AF00" }}>
              {active ? "online" : "offline"}
            </Text>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView ref={scrollviewRef} style={{ flex: 1, paddingBottom: 100 }}>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1, flexDirection: "row", paddingBottom: 80 }}
          >
            <View style={{ width: width }}>
              {messages?.map((message, i) => (
                <View
                  key={message?._id || i}
                  style={{
                    flexDirection:
                      message.sender?._id !== user?._id ? "row" : "row-reverse",
                    width: width,
                    marginTop: 8,
                    padding: 10,
                    paddingBottom: 2,
                    paddingTop: 2,
                  }}
                >
                  {message.messageType == "video" && (
                    <View
                      style={{
                        paddingHorizontal: 25,
                        backgroundColor:
                          message.sender?._id !== user?._id
                            ? "#8b91e2"
                            : "#ABE6D2",

                        paddingVertical: 6,
                        borderRadius: 15,
                        lineHeight: 20,
                        borderTopLeftRadius:
                          message.sender?._id !== user?._id ? 15 : 10,
                        borderTopRightRadius:
                          message.sender?._id !== user?._id ? 10 : 15,
                      }}
                    >
                      <Video
                        resizeMode="contain"
                        style={{ width: 250, height: 250 }}
                        useNativeControls={true}
                        source={{ uri: message.url }}
                      />
                    </View>
                  )}
                  {message.messageType == "image" && (
                    <View
                      style={{
                        paddingHorizontal: 25,
                        backgroundColor:
                          message.sender?._id !== user?._id
                            ? "#8b91e2"
                            : "#ABE6D2",

                        paddingVertical: 6,
                        borderRadius: 15,
                        lineHeight: 20,
                        borderTopLeftRadius:
                          message.sender?._id !== user?._id ? 15 : 10,
                        borderTopRightRadius:
                          message.sender?._id !== user?._id ? 10 : 15,
                      }}
                    >
                      <Image
                        style={{
                          width: 250,
                          height: 250,
                          objectFit: "contain",
                        }}
                        source={{ uri: message.url }}
                      />
                    </View>
                  )}
                  {message.messageType == "text" && (
                    <Text
                      style={{
                        paddingHorizontal: 25,
                        backgroundColor:
                          message.sender?._id !== user?._id
                            ? "#8b91e2"
                            : "#ABE6D2",
                        width: "auto",

                        maxWidth: 250,
                        paddingVertical: 6,
                        borderRadius: 15,
                        lineHeight: 20,
                        borderTopLeftRadius:
                          message.sender?._id !== user?._id ? 15 : 10,
                        borderTopRightRadius:
                          message.sender?._id !== user?._id ? 10 : 15,
                      }}
                    >
                      {message.text}
                    </Text>
                  )}
                  {message.messageType == "audio" && (
                    <View
                      style={{
                        paddingHorizontal: 25,
                        backgroundColor:
                          message.sender?._id !== user?._id
                            ? "#8b91e2"
                            : "#ABE6D2",

                        paddingVertical: 6,
                        borderRadius: 15,
                        lineHeight: 20,
                        borderTopLeftRadius:
                          message.sender?._id !== user?._id ? 15 : 10,
                        borderTopRightRadius:
                          message.sender?._id !== user?._id ? 10 : 15,
                      }}
                    >
                      <Video
                        resizeMode="contain"
                        style={{ width: 200, height: 80 }}
                        useNativeControls={true}
                        source={{ uri: message.url }}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScrollView>
      {/* footer */}
      <View
        style={{
          backgroundColor: "white",
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: 60,
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          borderTopWidth: 1,
          paddingHorizontal: 10,
          borderColor: "#CBCBCB",
        }}
      >
        <Entypo name="emoji-flirt" size={24} color="black" />
        <TextInput
          value={text}
          onChangeText={(t) => setText(t)}
          style={{ flex: 1 }}
          placeholder="Type a message"
        />
        {text ? (
          <Ionicons
            onPress={handleSendMessage}
            name="send"
            size={24}
            color="#4e85de"
          />
        ) : (
          <>
            <Feather
              name="paperclip"
              size={24}
              color="black"
              onPress={handleVideoAndPhoto}
            />
            <Feather
              onPress={() =>
                setcameraData((pre) => ({ ...pre, modalOpen: true }))
              }
              name="camera"
              size={24}
              color="black"
            />

            <View>
              <AudioRecordAndPlay sendAudio={sendAudio} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ChatScreen;
