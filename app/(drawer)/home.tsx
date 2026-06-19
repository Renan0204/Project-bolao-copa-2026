// app/(drawer)/home.tsx
import { useRouter } from "expo-router"; // Adicionado para fazer a navegação funcionar
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter(); // Inicializando o roteador

  return (
    <ScrollView style={styles.container}>
      {/* O cabeçalho (com as 3 barrinhas) é injetado automaticamente pelo _layout.tsx do Drawer */}

      <Text style={styles.greeting}>Olá, Usuário</Text>

      <View style={styles.drawnRow}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Próximas {"\n"}partidas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Ranking {"\n"}resumido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Pontuação {"\n"}atual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.featuredCard}>
        <Text style={styles.matchText}>Brasil x Haiti</Text>
        <TouchableOpacity 
          style={styles.palpitarButton}
          onPress={() => router.push('/(drawer)/detalhesPartida')} // Rota conectada!
        >
          <Text style={styles.palpitarText}>palpitar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Palpitar</Text>

      <View style={styles.gridRow}>
        <View style={styles.smallCard}>
          <Text style={styles.smallMatchText}>México x África</Text>
          <TouchableOpacity 
            style={styles.palpitarButton}
            onPress={() => router.push('/(drawer)/detalhesPartida')} // Rota conectada!
          >
            <Text style={styles.palpitarText}>palpitar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.smallMatchText}>Japão x EUA</Text>
          <TouchableOpacity 
            style={styles.palpitarButton}
            onPress={() => router.push('/(drawer)/detalhesPartida')} // Rota conectada!
          >
            <Text style={styles.palpitarText}>palpitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  drawnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  tabButton: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "32%",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  featuredCard: {
    backgroundColor: "#FFF",
    paddingVertical: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    borderRadius: 5,
  },
  matchText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  palpitarButton: {
    borderWidth: 1,
    borderColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 5,
  },
  palpitarText: {
    fontWeight: "bold",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  smallCard: {
    backgroundColor: "#FFF",
    width: "48%",
    paddingVertical: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  smallMatchText: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
});