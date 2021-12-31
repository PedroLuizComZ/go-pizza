import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "@src/screens/Home";
import { Orders } from "@src/screens/Orders";
import { useTheme } from "styled-components/native";
import { Platform } from "react-native";
import { BottomMenu } from "@src/components/BottomMenu";
import firestore from "@react-native-firebase/firestore"

const { Navigator, Screen } = createBottomTabNavigator();

export function UserTabRoutes() {
  const { COLORS } = useTheme();
  const [notifications, setNotifications] = useState("0");

  useEffect(() => {
    const subscribe = firestore()
      .collection("order")
      .where("status", "==", "Pronto")
      .onSnapshot((querySnapshot) => {
        setNotifications(String(querySnapshot.docs.length))
      });

    return () => subscribe();
  },[])

  return (
    <Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.SECONDARY_900,
        tabBarInactiveTintColor: COLORS.SECONDARY_400,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          paddingVertical: Platform.OS === "ios" ? 20 : 0,
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Cardapio" color={color} />
          ),
        }}
      />
      <Screen name="orders" component={Orders} options={{
          tabBarIcon: ({ color }) => (
            <BottomMenu title="Pedidos" color={color} notifications={notifications} />
          ),
        }} />
    </Navigator>
  );
}
