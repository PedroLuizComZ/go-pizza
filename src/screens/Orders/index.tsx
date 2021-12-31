import React, { useEffect, useState } from "react";

import { ItemSeparator } from "@src/components/ItemSeparator";
import { OrderCard } from "@src/components/OrderCard";
import { Alert, FlatList } from "react-native";
import firestore from "@react-native-firebase/firestore";

import { Container, Header, Title } from "./style";
import { useAuth } from "@src/hooks/auth";
import { StatusTypesProps } from "@src/components/OrderCard/style";

export type Order = {
  id: string;
  amount: number;
  image: string;
  pizza: string;
  quantity: number;
  size: string;
  table_number: string;
  status: StatusTypesProps;
  waiter_id: string;
};

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const subscribe = firestore()
      .collection("order")
      .where("waiter_id", "==", `${user?.id}`)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as Order[];

        setOrders(data);
      });

    return () => subscribe();
  }, []);

  function handlePizzaDelivered(id: string) {
    Alert.alert("Pedido", "Confirmar que a pizza foi entregue ?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => {
          firestore().collection("order").doc(id).update({
            status: "Entregue",
          });
        },
      },
    ]);
  }

  return (
    <Container>
      <Header>
        <Title>Pedidos Feitos</Title>
      </Header>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <OrderCard
            index={index}
            data={item}
            disabled={item.status !== 'Pronto'}
            onPress={() => handlePizzaDelivered(item.id)}
          />
        )}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 125, paddingHorizontal: 24 }}
        ItemSeparatorComponent={() => <ItemSeparator />}
      />
    </Container>
  );
}
