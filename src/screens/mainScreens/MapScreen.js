import React from "react";
import { View, Text, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const MapScreen = ({ route }) =>{
  const coordinate={
    latitude: Number(route.params.info.location.latitude),
    longitude: Number(route.params.info.location.longitude),
  }
  return(
  <View>
    <MapView
      showsCompass={true}
      style={{ width: "100%", height: "75%" }}
      minZoomLevel={5}
      initialRegion={{...coordinate,latitudeDelta: 0.1,
        longitudeDelta: 0.1}}
    >
      <Marker
        title="like photo"
        coordinate={
          coordinate
        }
      >
        <Image
          style={{
            width: 30,
            height: 30,
            marginBottom: 10,
            borderRadius: 10,
          }}
          source={{ uri: route.params.info.image }}
        />
      </Marker>
    </MapView>
    <View style={{ backgroundColor: "#51995d38", padding:4, height:'25%' }}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 14,
        }}
      >
        Post: "{route.params.info.postTitle}"
      </Text>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <Text>Author: {route.params.info.userName}</Text>
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 4,
          }}
          source={{
            uri: route.params.info.avatar,
          }}
        />
      </View>
    </View>
  </View>
)} ;
