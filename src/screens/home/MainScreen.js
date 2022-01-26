import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PostsScreen } from "../mainScreens/PostsScreen";
import { MapScreen } from "../mainScreens/MapScreen";
import { CommentsScreen } from "../mainScreens/CommentsScreen";

const RootMain = createStackNavigator();

export const MainScreen = () => (
  <RootMain.Navigator>
    <RootMain.Screen
      options={{
        headerShown: false,
      }}
      name="Posts"
      component={PostsScreen}
    />
    <RootMain.Screen
      // options={{ headerShown: false }}
      name="Map"
      component={MapScreen}
    />
    <RootMain.Screen
      // options={{ headerShown: false }}
      name="Comments"
      component={CommentsScreen}
    />
  </RootMain.Navigator>
);