import React, { useCallback, useState } from "react";
import happyIcon from "@assets/happy.png";
import { MaterialIcons } from "@expo/vector-icons";

import {
  Container,
  Greeting,
  GreetingEmoji,
  GreetingText,
  Header,
  MenuHeader,
  MenuItensNumber,
  NewProductButton,
  Title,
} from "./style";
import { useTheme } from "styled-components";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { Search } from "@src/components/Search";
import { ProductCard, ProductData } from "@src/components/ProductCard";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "@src/hooks/auth";

export function Home() {
  const { COLORS } = useTheme();
  const { logout, user } = useAuth();
  const [pizzas, setPizzas] = useState<ProductData[]>([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchPizza("");
    }, [])
  );

  async function handleSearch() {
    fetchPizza(search);
  }

  async function handleSearchClear() {
    fetchPizza("");
    setSearch("");
  }

  async function fetchPizza(value: string) {
    const valueFormated = value.toLowerCase().trim();

    firestore()
      .collection("pizza")
      .orderBy("name_insensitive")
      .startAt(valueFormated)
      .endAt(`${valueFormated}\uf8ff`)
      .get()
      .then((response) => {
        const data = response.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as ProductData[];

        setPizzas(data);
      })
      .catch(() =>
        Alert.alert("Consulta", "Não foi possivel realizar a consulta")
      );
  }

  function handleOpen(id: string) {
    const route = user?.isAdmin ? "product" : "order";
    navigation.navigate(route, { id });
  }

  function handleAddButton() {
    navigation.navigate("product", {});
  }

  return (
    <Container>
      <Header>
        <Greeting>
          <GreetingEmoji source={happyIcon} />
          <GreetingText>Ola NOME</GreetingText>
        </Greeting>
        <TouchableOpacity onPress={logout}>
          <MaterialIcons name="logout" color={COLORS.TITLE} size={24} />
        </TouchableOpacity>
      </Header>
      <Search
        onChangeText={setSearch}
        value={search}
        onSearch={handleSearch}
        onClear={handleSearchClear}
      />

      <MenuHeader>
        <Title>Cardapio</Title>
        <MenuItensNumber>{pizzas.length} pizzas</MenuItensNumber>
      </MenuHeader>

      <FlatList
        data={pizzas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard data={item} onPress={() => handleOpen(item.id)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: 125,
          marginHorizontal: 24,
        }}
      />
      {user?.isAdmin && (
        <NewProductButton
          title="Cadastrar Pizza"
          type="secondary"
          onPress={handleAddButton}
        />
      )}
    </Container>
  );
}
