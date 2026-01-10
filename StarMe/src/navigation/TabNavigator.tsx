import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/HomeScreen";
import CaptureScreen from "../screens/CaptureScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HistoryGridScreen from "../screens/HistoryGridScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0b0b0b",
          borderTopColor: "#222",
          height: 60,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "ellipse";

          switch (route.name) {
            case "Memory":
              iconName = focused ? "home" : "home-outline"; // Feed
              break;
            case "Capture":
              iconName = focused ? "camera" : "camera-outline";
              break;
            case "History":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "Profile":
              iconName = focused ? "person" : "person-outline";
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? size + 2 : size}
              color={color}
              style={{
                textShadowColor: focused ? "#FFD700" : "transparent",
                textShadowRadius: focused ? 10 : 0,
              }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Memory" component={HomeScreen} options={{ tabBarLabel: 'Feed' }} />
      <Tab.Screen name="Capture" component={CaptureScreen} options={{ tabBarLabel: 'Camera' }} />
      <Tab.Screen name="History" component={HistoryGridScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
