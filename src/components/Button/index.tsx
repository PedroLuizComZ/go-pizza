import React from "react";
import { RectButtonProps } from "react-native-gesture-handler";
import { Container, Load, Title, TypeProps } from "./style";

type Props = RectButtonProps & {
  type?: TypeProps;
  title: string;
  isLoading?: boolean;
};

export function Button({
  title,
  type = "primary",
  isLoading = false,
  ...rest
}: Props) {
  return <Container  type={type} enabled={!isLoading} {...rest} >
      {isLoading ? <Load /> : <Title>{title}</Title>}
  </Container>;
}
