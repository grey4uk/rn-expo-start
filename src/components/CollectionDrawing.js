import React, { useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  StyleSheet,
  Modal,
  TouchableHighlight,
  View,
} from "react-native";
import { firestore } from "../firebase/config";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export const CollectionDrawing = ({ data }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const getCurrentUserPost = async (id) => {
    const data = await firestore.collection("posts").doc(id).get();
    await firestore
      .collection("posts")
      .doc(id)
      .update({
        like:Number(data.data().like)? Number(data.data().like) + 1:1,
      });
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item, indx) => indx.toString()}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onLongPress={() => navigation.navigate("Map", { info: item })}
            style={styles.postContainer}
          >
            <TouchableOpacity
              style={styles.like}
              onPress={() => getCurrentUserPost(item.id)}
            >
              <Ionicons name="heart-outline" size={48} color="red" />
              <Text style={{position:"absolute"}}>{item.like?item.like:0}</Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Image
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  margin: 10,
                }}
                source={{
                  uri: item.avatar,
                }}
              />
              <TouchableOpacity
                style={styles.comments}
                onPress={() => navigation.navigate("Comments",{item})}
              >
                <Text style={{marginRight:10}}>"{item.postTitle}"</Text>
                <Ionicons name="md-document-text" size={48} color="black" />
              </TouchableOpacity>
            </View>
            <Image style={styles.image} source={{ uri: item.image }} />
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
                  <TouchableHighlight
                    style={{ marginTop: 50 }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <View>
                      <Text>Hide Modal</Text>
                      <Image
                        style={styles.postImage}
                        source={{ uri: item.image }}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    width: 300,
    borderRadius: 10,
    height: 240,
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  image: {
    width: 220,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    right: 10,
    bottom: 10,
    position: "absolute",
  },
  like: {
    // borderWidth: 1,
    // borderColor: "red",
    // borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    left: 15,
  },
  comments: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    width:240,
    // padding:20,
  },
  centeredView: {
    backgroundColor: "red",
    width: 350,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
});
