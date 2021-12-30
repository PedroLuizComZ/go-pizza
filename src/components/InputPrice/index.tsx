import React from "react";
import { Container, Size, SizeLabel, Input } from "./style";
import { TextInputProps } from "react-native";

type Props = TextInputProps & {
  size: string;
};

export function InputPrice({ size, ...rest }: Props) {
  return (
    <Container>
      <Size>
        <SizeLabel>{size}</SizeLabel>
      </Size>

      <SizeLabel>R$</SizeLabel>

      <Input keyboardType="numeric" {...rest} />
    </Container>
  );
}
