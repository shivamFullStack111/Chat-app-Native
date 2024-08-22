import { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { Audio, Video } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const AudioRecordAndPlay = ({ sendAudio }) => {
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  // k
  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    sendAudio(uri);
  }

  return (
    <View>
      <Ionicons
        onPress={recording ? stopRecording : startRecording}
        name={recording ? "mic" : "mic-off"}
        size={24}
        color="black"
      />
    </View>
  );
};

// import { View, Text } from "react-native";
// import React from "react";
// import { MaterialIcons } from "@expo/vector-icons";

// const AudioRecordAndPlay = () => {
//   return (
//     <View>
//       <MaterialIcons  onPress={recording ? stopRecording : startRecording} name="keyboard-voice" size={24} color="black" />
//     </View>
//   );
// };

export default AudioRecordAndPlay;
