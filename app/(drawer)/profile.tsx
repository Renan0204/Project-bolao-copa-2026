// app/(drawer)/profile.tsx
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// IMPORTANTE: Verifique se o caminho abaixo está correto para a sua pasta componentes
import { Button } from "../../componentes/Button";

export default function ProfileScreen() {
  const router = useRouter();

  function onSairPress() {
    // Redireciona para o login e remove o histórico da navegação
    router.replace("/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://avatars.githubusercontent.com/u/106830297?v=4",
          }}
          style={styles.profileImage}
        />

        <Text style={styles.textName}>João Grande</Text>

        <Text style={styles.textBio}>Eu gosto de react native</Text>

        <Button
          texto="Sair"
          icon={false}
          role="danger"
          quandoClicar={onSairPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "100%",
    maxWidth: 300, // Aumentei levemente para ficar mais confortável
  },
  textName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textBio: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    marginBottom: 20, // Adicionei margem para separar do botão
  },
});
