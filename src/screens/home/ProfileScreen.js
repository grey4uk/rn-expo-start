import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
// import { CollectionDrawing } from "../../components/CollectionDrawing";
import { useSelector, useDispatch } from "react-redux";
import { auth, firestore } from "../../firebase/config";

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const [currentUserPost, setcurrentUserPost] = useState([]);

  const { userId, userName, avatar } = useSelector((state) => state.user);

  useEffect(() => {
    getCurrentUserPosts();
  }, [getCurrentUserPosts]);

  const getCurrentUserPosts = useCallback(async () => {
    await firestore
      .collection("posts")
      .where("userId", "==", userId)
      .onSnapshot((data) =>
        setcurrentUserPost(data.docs.map((doc) => doc.data()))
      );
  },[userId]);

  const signOut = async () => {
    await auth.signOut();
    dispatch({ type: "USER_SIGNOUT" });
  };

  return (
    <View style={styles.container}>
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Image
          source={{
            uri:
              "https://picua.org/images/2020/03/25/5a58e84e1c52070b88ab342ec2b3bc16.jpg",
          }}
          // {require("../../assets/images/road.jpg")||"https://picua.org/images/2020/04/20/b0bee066d47e2e7afa2078d8df52c728.jpg"}
          style={{ flex: 1, width: null, height: null }}
        />
      </View>
      <TouchableOpacity style={styles.btn} onPress={signOut}>
        <Text style={styles.btnTitle}>SignOut {userName}</Text>
      </TouchableOpacity>
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          margin: 10,
        }}
        source={{
          uri: avatar
            ? avatar
            : "https://picua.org/images/2020/04/20/41581d17aefc850989b9ca98f49c2a03.jpg",
        }}
      />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.myPostTitle}>{userName} posts</Text>
        {/* <CollectionDrawing data={currentUserPost} /> */}
        <View
          style={{
            width: "90%",
            padding: "auto",
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            // alignItems:"center"
          }}
        >
          <FlatList
            data={currentUserPost}
            horizontal={false}
            keyExtractor={(item, indx) => indx.toString()}
            numColumns={2}
            renderItem={({ item }) => {
              // console.log("post", item);
              return (
                <View
                  style={styles.post}
                >
                  <Text>"{item.postTitle}"</Text>
                  <Image style={styles.image} source={{ uri: item.image }} />
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
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
    height: "auto",
    width: "auto",
    backgroundColor: "#556b2f",
    padding: 10,
    borderRadius: 18,
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  btnTitle: {
    color: "#fff",
    fontSize: 18,
  },
  myPostTitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    backgroundColor: "#556b2f",
    margin: 10,
    padding: 10,
    borderRadius: 20,
  },
  image: {
    width: 120,
    height: 90,
    borderRadius: 10,
  },
  post:{
    backgroundColor: "#fff",
    maxWidth:140,
    padding: 10,
    borderColor: "#556b2f",
    borderWidth: 1,
    borderRadius: 10,
    flex:1,
    flexDirection:"column",
    justifyContent:"space-between",
  }
});
