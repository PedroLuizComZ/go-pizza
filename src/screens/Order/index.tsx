import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { BackButton } from "@src/components/BackButton";
import { Button } from "@src/components/Button";
import { Input } from "@src/components/Input";
import { RadioButton } from "@src/components/RadioButton";
import { PIZZA_TYPES } from "@src/utils/pizzaTypes";
import { Alert, Platform, ScrollView } from "react-native";

import firestore from "@react-native-firebase/firestore";

import {
  Container,
  Form,
  FormRow,
  Header,
  Image,
  InputGroup,
  Label,
  Price,
  Sizes,
  Title,
} from "./style";
import { OrderNavigationProps } from "@src/types/navigation";
import { ProductData } from "@src/components/ProductCard";
import { useAuth } from "@src/hooks/auth";

type PizzaResponse = ProductData & {
  price_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);

  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const { id } = route.params as OrderNavigationProps;

  const amount = size ? pizza.price_sizes[size] * quantity : "0,00";

  function handleGoBack() {
    navigation.goBack();
  }

  function handleOrder() {
    if (!size) {
      return Alert.alert("Pedido", "Selecione o tamanho da pizza");
    }

    if (!tableNumber) {
      return Alert.alert("Pedido", "Selecione o numero da mesa");
    }

    if (!quantity) {
      return Alert.alert("Pedido", "Selecione a quantidade de pizzas");
    }

    setLoading(true);

    firestore()
      .collection("order")
      .add({
        quantity,
        amount,
        pizza: pizza.name,
        size,
        table_number: tableNumber,
        waiter_id: user?.id,
        image: pizza.photo_url,
        status: 'Preparando'
      })
      .then(() => {
        navigation.navigate("home");
      })
      .catch(() => {
        Alert.alert("Pedido", "Não foi possivel realizar o pedido");
        setLoading(false);
      })
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizza")
        .doc(id)
        .get()
        .then((response) => {
          setPizza(response.data() as PizzaResponse);
        })
        .catch(() => {
          Alert.alert("Pedido", "Nao foi possivel carregar a pizza");
        });
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={handleGoBack} style={{ marginBottom: 108 }} />
        </Header>
        <Image source={{ uri: pizza.photo_url }} />
        <Form>
          <Title>{pizza?.name}</Title>
          <Label>Selecione um tamanho</Label>
          <Sizes>
            {PIZZA_TYPES.map((pizza) => {
              return (
                <RadioButton
                  key={pizza.id}
                  title={pizza.name}
                  selected={size === pizza.id}
                  onPress={() => setSize(pizza.id)}
                />
              );
            })}
          </Sizes>
          <FormRow>
            <InputGroup>
              <Label>Numero da Mesa</Label>
              <Input
                keyboardType="numeric"
                onChangeText={setTableNumber}
                value={tableNumber}
              />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>
          <Price>Valor de R$ {amount} </Price>

          <Button title="Confirmar pedido" isLoading={loading} onPress={handleOrder} />
        </Form>
      </ScrollView>
    </Container>
  );
}
