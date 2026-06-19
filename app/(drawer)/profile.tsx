import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertHelper } from "../utils/AlertHelper"; // caminho corrigido

export default function ProfileScreen() {
  const router = useRouter();

  function onSairPress() {
    AlertHelper.warning("Deseja sair de sua conta?");
    router.replace("/login");
  }

  function onExcluirContaPress() {
    AlertHelper.warning("Tem certeza que deseja excluir sua conta permanentemente?");
    // simulação de exclusão
    const excluido = true;
    if (excluido) {
      AlertHelper.error("Conta excluída.");
      router.replace("/login");
    } else {
      AlertHelper.error("Erro ao excluir conta.");
    }
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

        <TouchableOpacity 
          style={styles.buttonSair} 
          onPress={onSairPress}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.buttonExcluir} 
          onPress={onExcluirContaPress}
        >
          <Text style={styles.buttonText}>Excluir Conta</Text>
        </TouchableOpacity>
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
    maxWidth: 300,
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
    marginBottom: 20,
  },
  buttonSair: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonExcluir: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
