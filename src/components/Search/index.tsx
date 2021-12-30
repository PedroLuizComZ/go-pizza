import React from "react";
import { Button, ButtonClear, Container, Input, InputArea } from "./style";

import { useTheme } from "styled-components";
import { Feather } from "@expo/vector-icons";
import { TextInputProps } from "react-native";

type Props = TextInputProps & {
  onSearch: () => void;
  onClear: () => void;
};

export function Search({ onSearch, onClear, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container>
      <InputArea>
        <Input placeholder="Pesquisar ..." {...rest} />
        <ButtonClear onPress={onClear}>
          <Feather name="x" size={18} />
        </ButtonClear>
      </InputArea>

      <Button onPress={onSearch}>
        <Feather name="search" size={18} color={COLORS.TITLE} />
      </Button>
    </Container>
  );
}
