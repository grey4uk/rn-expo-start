import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { firestore } from "../../firebase/config";
import { CollectionDrawing } from "../../components/CollectionDrawing";

export const PostsScreen = () => {

  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const unsubscribe=getCollection();
    return unsubscribe;
  }, [getCollection]);

  const getCollection = useCallback(async () => {
   return await firestore.collection("posts").onSnapshot((data) => {
      setAllPosts(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
  },[]);

  return (
    <View style={styles.container}>
      <View style={{ ...StyleSheet.absoluteFill }}>
        <Image
          source={{uri:"https://picua.org/images/2020/03/25/5a58e84e1c52070b88ab342ec2b3bc16.jpg"}}
          // {require("../../assets/images/road.jpg")||"https://picua.org/images/2020/04/20/b0bee066d47e2e7afa2078d8df52c728.jpg"}
          style={{ flex: 1, width: null, height: null }}
        />
      </View>
      <CollectionDrawing data={allPosts} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#51995d38",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  },

  imageBlock: {
    width: 300,
    borderRadius: 10,
    height: 240,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 20,
  },

  postImage: {
    width: 220,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    right: 10,
    bottom: 10,
    position: "absolute",
  },
});
