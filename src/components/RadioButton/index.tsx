import React from "react";
import { Container, Radio, RadioButtonProps, Selected, Title } from "./style";
import { TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps &
  RadioButtonProps & {
    title: string;
  };

export function RadioButton({ title, selected, ...rest }: Props) {
  return (
    <Container selected={selected} {...rest}>
      <Radio>{selected && <Selected />}</Radio>
      <Title>{title}</Title>
    </Container>
  );
}
