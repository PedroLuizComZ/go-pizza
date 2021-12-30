import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "@src/screens/Home";
import { Product } from "@src/screens/Product";
import { Order } from "@src/screens/Order";

const {Navigator, Screen} = createNativeStackNavigator()

export function UserStackRoutes( ) {
    return (
        <Navigator screenOptions={{headerShown: false}}> 
            <Screen name="order" component={Order}  />
            <Screen name="home" component={Home}  />
            <Screen name="product" component={Product}  />
        </Navigator>
    )
}