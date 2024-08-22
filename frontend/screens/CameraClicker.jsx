import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

export default function CameraClicker({
  cameraData,
  setcameraData,
  sendRecordVideo,
  sendCaptureImage,
}) {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef(null);

  const { type, isRecording, uri, modalOpen } = cameraData;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const clickPhoto = async () => {
    try {
      if (cameraRef.current) {
        console.log("Camera ref is available");
        const image = await cameraRef.current.takePictureAsync();
        console.log(image);
        sendCaptureImage(image.uri);

        setcameraData({ ...cameraData, modalOpen: false });
      } else {
        console.log("Camera ref is not available");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current) {
      setcameraData({ ...cameraData, isRecording: true });
      const video = await cameraRef.current.recordAsync();
      setcameraData((prev) => ({ ...prev, uri: video.uri }));
      sendRecordVideo(video.uri);
    }
  };
  const stopRecording = () => {
    setcameraData({ ...cameraData, isRecording: false });
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        // mode={Camera.Constants.Mode.photo}
        ref={cameraRef}
        zoom={0}
        // mode="video"
        mode={type == "image" ? "picture" : "video"}
        style={styles.camera}
        facing={facing}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <View style={{ alignSelf: "flex-end", padding: 20 }}>
              <Entypo
                onPress={() =>
                  setcameraData((pre) => ({ ...pre, modalOpen: false }))
                }
                name="circle-with-cross"
                size={34}
                color="red"
              />
            </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: "cloumn",
              justifyContent: "flex-end",
              alignItems: "center",
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                backgroundColor: "white",
                borderRadius: 20,
                position: "absolute",
                bottom: 120,
              }}
            >
              <Text
                onPress={() =>
                  setcameraData((pre) => ({ ...pre, type: "image" }))
                }
                style={{
                  backgroundColor: type == "image" ? "#5b99e4" : "white",
                  paddingHorizontal: 16,
                  fontWeight: "600",
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: type == "image" ? "white" : "black",
                }}
              >
                photo
              </Text>
              <Text
                onPress={() =>
                  setcameraData((pre) => ({ ...pre, type: "video" }))
                }
                style={{
                  backgroundColor: type == "video" ? "#5b99e4" : "white",
                  paddingHorizontal: 16,
                  fontWeight: "600",
                  paddingVertical: 5,
                  borderRadius: 20,
                  color: type == "video" ? "white" : "black",
                }}
              >
                video
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {type == "video" && (
                <View>
                  {isRecording ? (
                    <TouchableOpacity
                      onPress={stopRecording}
                      style={{
                        backgroundColor: "white",
                        width: 58,
                        height: 58,
                        borderRadius: 250,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 5,
                      }}
                    >
                      <FontAwesome name="video-camera" size={24} color="red" />
                      <Text style={{ fontSize: 10, fontWeight: 700 }}>
                        00:00:87
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <MaterialCommunityIcons
                      onPress={() => startRecording()}
                      name="record-circle"
                      size={70}
                      color="white"
                    />
                  )}
                </View>
              )}
              {type == "image" && (
                <TouchableOpacity
                  onPress={clickPhoto}
                  style={{
                    backgroundColor: "white",
                    width: 58,
                    height: 58,
                    borderRadius: 250,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-iris"
                    size={30}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
