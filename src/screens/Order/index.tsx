import { BackButton } from "@src/components/BackButton";
import React from "react";
import { Platform } from "react-native";

import { Container, Header, Image } from "./style";

export function Order() {
  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Header>
        <BackButton onPress={() => {}} style={{ marginBottom: 108 }} />
      </Header>
      <Image source={{ uri: "https://github.com/PedroLuizComZ.png"}} />
    </Container>
  );
}
