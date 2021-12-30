import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogging, setIsLogging] = useState(false);

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert("Login", "Informe email e senha");
    }

    setIsLogging(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((account) => {
        firestore()
          .collection("users")
          .doc(account.user.uid)
          .get()
          .then(async (profile) => {
            const { isAdmin, name } = profile.data() as User;

            if (profile.exists) {
              const userData = {
                id: account.user.uid,
                name,
                isAdmin,
              };
              await AsyncStorage.setItem("user", JSON.stringify(userData));
              setUser(userData);
            }
          })
          .catch(() => {
            Alert.alert(
              "Login",
              "Nao foi possivel buscar os dados do perfil do usuario"
            );
          });
      })
      .catch((error) => {
        const { code } = error;

        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          Alert.alert("Login", "Email e/ou senha incorreto");
        } else {
          Alert.alert("Login", "Não foi possivel realizar o login");
        }
      })
      .finally(() => setIsLogging(false));
  }

  async function loadStorageData() {
    setIsLogging(true);

    let storageUser = await AsyncStorage.getItem("user");

    if (storageUser) {
      const userData = JSON.parse(storageUser) as User;
      setUser(userData);
    }
    setIsLogging(false);
  }

  async function logout() {
    await auth().signOut();
    await AsyncStorage.removeItem("user");
    setUser(null);
  }

  async function forgotPassword(email: string) {
    if (!email) {
      return Alert.alert("Esqueci minha Senha", "Informe o email");
    }

    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          "Esqueci minha Senha",
          "Enviamos um link no se email para redefinir sua senha"
        );
      })
      .catch(() => {
        Alert.alert(
          "Esqueci minha Senha",
          "Nao conseguimos enviar o link para redefinir sua senha"
        );
      });
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider
      value={{ signIn, logout, forgotPassword, isLogging, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
