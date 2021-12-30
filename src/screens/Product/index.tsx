import React, { Fragment, useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { BackButton } from "@src/components/BackButton";
import { Button } from "@src/components/Button";
import { Input } from "@src/components/Input";
import { InputPrice } from "@src/components/InputPrice";
import { Photo } from "@src/components/Photo";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Container,
  DeleteLabel,
  Form,
  Header,
  InputGroup,
  InputGroupHeader,
  Label,
  MaxCharacters,
  PickImageButton,
  Title,
  Upload,
} from "./style";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ProductNavigationProps } from "@src/types/navigation";
import { ProductData } from "@src/components/ProductCard";

type PizzaResponse = ProductData & {
  photo_path: string;
  price_sizes: {
    p: string;
    m: string;
    g: string;
  };
};

export function Product() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceSizeP, setPriceSizeP] = useState("");
  const [priceSizeM, setPriceSizeM] = useState("");
  const [priceSizeG, setPriceSizeG] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [photoPath, setPhotoPath] = useState("");

  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as ProductNavigationProps;

  async function handleFormSubmmit() {
    if (!name.trim()) {
      return Alert.alert("Cadastro", "Informe o nome da Pizza");
    }

    if (!description.trim()) {
      return Alert.alert("Cadastro", "Informe a descrição da Pizza");
    }

    if (!image) {
      return Alert.alert("Cadastro", "Selecione a imagem da Pizza");
    }

    if (!priceSizeP || !priceSizeM || !priceSizeG) {
      return Alert.alert(
        "Cadastro",
        "Informe Valor da pizza em todos os tamanhos"
      );
    }

    setIsLoading(true);

    const fileName = new Date().getTime();
    const reference = storage().ref(`/pizzas/${fileName}.png`);


    await reference.putFile(image);
    const photo_url = await reference.getDownloadURL();

    firestore()
      .collection("pizza")
      .add({
        name,
        name_insensitive: name.toLowerCase().trim(),
        description,
        price_sizes: {
          p: priceSizeP,
          m: priceSizeM,
          g: priceSizeG,
        },
        photo_url,
        photo_path: reference.fullPath,
      })
      .then(() => {
        navigation.navigate('home')
      })
      .catch(() => {
        Alert.alert("Cadastro", "Não foi possivel cadastrar a Pizza");
      });

    setIsLoading(false);
  }

  async function handlePickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 4],
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    }
  }

  function handleBackButton() {
    navigation.goBack();
  }

  async function handleDelete() {
    firestore().collection("pizza").doc(id).delete().then(() => {
      storage().ref(photoPath).delete().then(() => {
        navigation.navigate('home')
      })
    })
  }

  useEffect(() => {
    if (id) {
      firestore()
        .collection("pizza")
        .doc(id)
        .get()
        .then((response) => {
          const product = response.data() as PizzaResponse;

          setName(product.name);
          setDescription(product.description);
          setImage(product.photo_url);
          setPriceSizeP(product.price_sizes.p);
          setPriceSizeM(product.price_sizes.m);
          setPriceSizeG(product.price_sizes.g);
          setPhotoPath(product.photo_path);
        });
    }
  }, [id]);

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <BackButton onPress={handleBackButton} />
          <Title>Pizza</Title>

          {id ? (
            <TouchableOpacity onPress={handleDelete}>
              <DeleteLabel>Deletar</DeleteLabel>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 20 }} />
          )}
        </Header>
        <Upload>
          <Photo uri={image} />
          {!id && (
            <PickImageButton
              title="Carregar"
              type="secondary"
              onPress={handlePickImage}
            />
          )}
        </Upload>
        <Form>
          <InputGroup>
            <Label>Nome</Label>
            <Input onChangeText={setName} value={name} />
          </InputGroup>

          <InputGroup>
            <InputGroupHeader>
              <Label>Descrição </Label>
              <MaxCharacters>0 de 60 Caracteres</MaxCharacters>
            </InputGroupHeader>
            <Input
              multiline
              maxLength={60}
              style={{ height: 85 }}
              onChangeText={setDescription}
              value={description}
            />
          </InputGroup>

          <InputGroup>
            <Label>Tamanhos e preços</Label>
            <InputPrice
              size="P"
              onChangeText={setPriceSizeP}
              value={priceSizeP}
            />
            <InputPrice
              size="M"
              onChangeText={setPriceSizeM}
              value={priceSizeM}
            />
            <InputPrice
              size="G"
              onChangeText={setPriceSizeG}
              value={priceSizeG}
            />
          </InputGroup>

          {!id && (
            <Button
              title="Cadastrar Pizza"
              isLoading={isLoading}
              onPress={handleFormSubmmit}
            />
          )}
        </Form>
      </ScrollView>
    </Container>
  );
}
