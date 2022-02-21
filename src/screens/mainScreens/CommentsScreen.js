import { useState } from "react";
import { useSelector } from "react-redux";
import { firestore } from "../../firebase/config";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

export const CommentsScreen = ({ route }) => {
  const [comments, setComments] = useState(route.params.item.comments ? route.params.item.comments : []);
  const [newComment, setNewComment] = useState("");
  const { avatar } = useSelector((state) => state.user);

  const addNewComment = async (id) => {
    if(newComment){await firestore
      .collection("posts")
      .doc(id)
      .update({
        comments: [...comments, { comment: newComment, avatar }],
      });
    const data = await firestore.collection("posts").doc(id).get();
    setComments(data.data().comments);
    setNewComment("")}
    else(Alert.alert("Empty comment"));
  };

  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        POST: "{route.params.item.postTitle}"
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Add your comment..."
        onChangeText={(value) => setNewComment(value)}
        value={newComment}
      />
      <TouchableOpacity
        onPress={() => addNewComment(route.params.item.id)}
        style={styles.btn}
      >
        <Text style={{ color: "#fff" }}>Add comment</Text>
      </TouchableOpacity>
      {comments && comments.length !== 0 && (
        <FlatList
          data={comments}
          keyExtractor={(item, indx) => indx.toString()}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  backgroundColor: "#51995d38",
                  padding: 10,
                  marginBottom:10,
                  borderColor: "#556b2f",
                  borderWidth: 1,
                  borderRadius: 10,
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{ width: 40, height: 40, borderRadius: 40, marginRight:20}}
                  source={{ uri: item.avatar }}
                />
                <Text>"{item.comment}"</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#556b2f",
    borderWidth: 2,
    borderRadius: 18,
    width: 300,
    height: 40,
    paddingLeft: 40,
    backgroundColor: "white",
    marginBottom: 10,
  },
  btn: {
    height: 40,
    width: 100,
    backgroundColor: "#556b2f",
    borderRadius: 18,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
