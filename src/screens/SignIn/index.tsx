import React, { useState } from "react";
import { Button } from "@src/components/Button";
import { Input } from "@src/components/Input";
import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import {
  Brand,
  Container,
  Content,
  ForgotPasswordButton,
  ForgotPasswordLabel,
  Title,
} from "./style";
import brandImage from "@assets/brand.png";
import { useAuth } from "@src/hooks/auth";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, forgotPassword, isLogging } = useAuth();

  function handleSignIn() {
    signIn(email, password);
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Content>
          <Brand source={brandImage} />
          <Title>Login</Title>
          <Input
            placeholder={"E-Mail"}
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <Input
            placeholder={"Senha"}
            type="secondary"
            secureTextEntry
            onChangeText={setPassword}
          />

          <ForgotPasswordButton onPress={() => forgotPassword(email)}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button
            title={"Entrar"}
            type="secondary"
            isLoading={isLogging}
            onPress={handleSignIn}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
