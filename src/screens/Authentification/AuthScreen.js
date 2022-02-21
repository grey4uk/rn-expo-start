import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import { Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { auth, storage } from "../../firebase/config";

const initialState = {
  email: "",
  password: "",
  displayName: "",
};

export const AuthScreen = () => {
  const [state, setState] = useState(initialState);
  const [message, setmessage] = useState(null);
  const [isRegister, setIsRegister] = useState(true);
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();

  const currentUser = async () => {
    const currentUser = await auth.currentUser;
    dispatch({
      type: "CURRENT_USER",
      payload: {
        userName: currentUser.displayName,
        userId: currentUser.uid,
        avatar: currentUser.photoURL
          ? currentUser.photoURL
          : "https://picua.org/images/2020/04/20/41581d17aefc850989b9ca98f49c2a03.jpg",
      },
    });
  };

  const getLocationPermission = async()=>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      status !== 'granted'&&Alert.alert("Needed access for use camera")    
  }

  const getCameraPermision=async()=>{
      const { status } = await Camera.requestCameraPermissionsAsync();
      status !== 'granted'&&Alert.alert("Needed access for use camera")
  }

  const getPermisions=async()=>{
await getCameraPermision();
await getLocationPermission();
  }

  useEffect(() => {
   getPermisions();
  }, []);

  const takePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setAvatar(result.uri);
  };

  const uploadAvatar = async (photo) => {
    if (photo) {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniqueId = Date.now().toString();
      await storage.ref(`avatar/${uniqueId}`).put(file);
      const url = await storage.ref("avatar").child(uniqueId).getDownloadURL();
      return url;
    } else
      uploadAvatar(
        "https://picua.org/images/2020/04/20/41581d17aefc850989b9ca98f49c2a03.jpg"
      );
  };

  const registerUser = async () => {
    Keyboard.dismiss();
    const { email, password, displayName } = state;
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);
      const convertedAvatar = await uploadAvatar(avatar);
      await user.user.updateProfile({
        displayName: displayName,
        photoURL: convertedAvatar,
      });
      await currentUser();
    } catch (error) {
      setmessage(error.message);
    }
  };

  const loginUser = async () => {
    Keyboard.dismiss();
    const { email, password } = state;
    try {
      await auth.signInWithEmailAndPassword(email, password);
      await currentUser();
    } catch (error) {
      setmessage(error.message);
    }
    setState(initialState);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={
            require("../../assets/images/road.jpg")
          }
          style={styles.image}
        >
          {/* <KeyboardAvoidingView
          behavior={Platform.Os == "ios" ? "padding" : "height"}
          style={styles.container}
        > */}
          <View style={styles.form}>
            {!isRegister && (
              <TouchableOpacity onPress={takePhoto}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    marginBottom: 30,
                  }}
                  source={{
                    uri: avatar
                      ? avatar
                      : "https://picua.org/images/2020/04/20/41581d17aefc850989b9ca98f49c2a03.jpg",
                  }}
                />
              </TouchableOpacity>
            )}
            {!isRegister && (
              <TextInput
                style={{ ...styles.input, marginBottom: 20 }}
                placeholder="enter nickname"
                value={state.displayName}
                onFocus={() => setmessage(null)}
                onChangeText={(value) =>
                  setState({ ...state, displayName: value })
                }
                onSubmitEditing={()=>Alert.alert(state.displayName)}
              />
            )}
            <TextInput
              style={{ ...styles.input, marginBottom: 20 }}
              placeholder="enter email"
              value={state.email}
              onFocus={() => setmessage(null)}
              onChangeText={(value) => setState({ ...state, email: value })}
            />
            <TextInput
              style={styles.input}
              placeholder="enter password"
              secureTextEntry={true}
              onChangeText={(value) => setState({ ...state, password: value })}
              value={state.password}
            />
            {message && <Text style={styles.inputError}>{message}</Text>}
            <TouchableOpacity
              style={styles.btn}
              onPress={isRegister ? loginUser : registerUser}
            >
              <Text style={styles.btnTitle}>Submit</Text>
            </TouchableOpacity>
            <View style={styles.btnBlock}>
              <TouchableOpacity
                style={styles.btn}
                onPress={
                  isRegister
                    ? () => setIsRegister(false)
                    : () => setIsRegister(true)
                }
              >
                <Text style={styles.btnTitle}>
                  {!isRegister ? "go Login" : "go Register"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* </KeyboardAvoidingView> */}
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
  },
  form: {
    alignItems: "center",
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
  inputError: { color: "#f00" },
  btnBlock: {
    flexDirection: "row",
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
});
