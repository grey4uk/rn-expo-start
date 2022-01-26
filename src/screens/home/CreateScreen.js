import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TouchableHighlight,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { firestore, storage } from "../../firebase/config";
import { useSelector } from "react-redux";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export const CreateScreen = () => {
  const { userId, userName, avatar } = useSelector((state) => state.user);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [takePhoto, settakePhoto] = useState("");
  const [photo, setphoto] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");


  const snap = async () => {
    if (takePhoto) {
      let file = await takePhoto.takePictureAsync();
      setphoto(file.uri);
      setModalVisible(true);
    }
  };

  const uploadStorage = async (photo) => {
    setModalVisible(!modalVisible);
    if (photo) {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniqueId = Date.now().toString();
      await storage.ref(`image/${uniqueId}`).put(file);
      const url = await storage.ref("image").child(uniqueId).getDownloadURL();
      createPost(url);
    } else Alert.alert("No photo");
    setPostTitle("");
  };

  const createPost = async (img) => {
    let location = await Location.getCurrentPositionAsync({});
    await firestore.collection("posts").add({
      image: img,
      postTitle:postTitle,
      avatar,
      userId,
      userName,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.Os == "ios" ? "padding" : "height"}
    style={styles.container}
  >
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Image
          source={{uri:"https://picua.org/images/2020/03/25/5a58e84e1c52070b88ab342ec2b3bc16.jpg"}}
          style={{ flex: 1, width: null, height: null }}
        />
      </View>
      {!modalVisible ? (
        <Camera
          ref={(ref) => settakePhoto(ref)}
          style={{ width: "96%", padding: 10, flex: 0.8 }}
          type={type}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              margin: 10,
            }}
            onPress={snap}
          >
            <Ionicons name="ios-camera" size={50} color={"blue"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              position: "absolute",
              padding: 10,
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 16, padding: 8, color: "blue" }}>
              Flip
            </Text>
          </TouchableOpacity>
        </Camera>
      ) : (
        <Modal
          style={styles.centeredView}
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View>
            <View
              style={{
                backgroundColor: "#2196F3",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
             
              <Image
                style={{ width: 280, height: 200 }}
                source={{ uri: photo }}
              />
              
                <TextInput
                  style={styles.input}
                  placeholder="Add title..."
                  onChangeText={(value) => setPostTitle(value)}
                  value={postTitle}
                />
              
              <TouchableOpacity
                onPress={() => uploadStorage(photo)}
                style={styles.btn}
              >
                <Text style={styles.btnTitle}>POST ?</Text>
              </TouchableOpacity>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View>
                  <Text style={styles.btnTitle}>Go next</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#51995d38",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    height: 40,
    width: 100,
    backgroundColor: "#556b2f",
    borderRadius: 18,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    color: "white",
    fontSize: 18,
  },
  centeredView: {
    backgroundColor: "#51995d38",
    width: 350,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  input: {
    borderColor: "#556b2f",
    borderWidth: 2,
    borderRadius: 18,
    width: 300,
    height: 40,
    paddingLeft: 40,
    backgroundColor: "white",
  },
});
