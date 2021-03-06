import React, { useState, useEffect, useCallback } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { StyleSheet,LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { AuthScreen } from "./src/screens/Authentification/AuthScreen";
import { MainScreen } from "./src/screens/home/MainScreen";
import { ProfileScreen } from "./src/screens/home/ProfileScreen";
import { CreateScreen } from "./src/screens/home/CreateScreen";
import { store, persistor } from "./src/redux/store";
import { auth } from "./src/firebase/config";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [isAuth, setIsAuth] = useState(null);

  LogBox.ignoreLogs(['Setting a timer']);

  useEffect(() => {
    const unsubscribe=AuthStateChanged();
    return unsubscribe
  }, [AuthStateChanged]);

  const AuthStateChanged = useCallback(async () => {
   return await auth.onAuthStateChanged(setIsAuth);
  },[isAuth]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          {isAuth ? (
            <Tab.Navigator
              screenOptions={{
                showLabel: false,
                inactiveBackgroundColor: "#51995d38",
                activeBackgroundColor: "#51995d38",
              }}
            >
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                      name="md-images"
                      size={focused ? 35 : size}
                      color={color}
                    />
                  ),
                }}
                name="Main"
                component={MainScreen}
              />
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                      name="ios-add-circle-outline"
                      size={focused ? 42 : size}
                      color={color}
                    />
                  ),
                }}
                name="Create"
                component={CreateScreen}
              />
              <Tab.Screen
                options={{
                  tabBarIcon: ({ focused, size, color }) => (
                    <Ionicons
                      name="md-settings"
                      size={focused ? 35 : size}
                      color={color}
                    />
                  ),
                }}
                name="Profile"
                component={ProfileScreen}
              />
            </Tab.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen
                options={{
                  headerShown: false,
                }}
                name="Auth"
                component={AuthScreen}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
