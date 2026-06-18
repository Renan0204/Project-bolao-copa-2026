import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../componentes/Header";
import { useCart } from "../../hooks/useCart";
import { Event } from "../../types/event";
import { buscarEventoPorId } from "../../services/eventService";

export default function EventDetailsScreen() {
  // Resgata os parâmetros passados na navegação
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const { adicionarItem, estaNoCarrinho } = useCart();
  const router = useRouter();

  const primaryColor = "#007AFF";
  const noCarrinho = estaNoCarrinho(id);

  async function carregarEvento() {
    const eventoCarregado = await buscarEventoPorId(id);
    setEvent(eventoCarregado);
  }

  useEffect(() => {
    carregarEvento();
  }, []);

  return (
    // EDGES: Define quais bordas do SafeAreaView devem ser consideradas para o espaçamento
    // Neste caso, estamos considerando apenas as bordas superior, esquerda e direita, permitindo que o conteúdo se estenda até a borda inferior, onde teremos um botão fixo.
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header title={event?.titulo || "Detalhes do Evento"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagem de Capa (Usando um placeholder genérico) */}
        <Image
          source={{
            uri:
              event?.imagem ||
              "https://via.placeholder.com/600x400?text=Imagem+do+Evento",
          }}
          style={styles.coverImage}
        />

        <View style={styles.content}>
          {/* Título do Evento recebido via parâmetro */}
          <Text style={styles.title}>{event?.titulo || "Nome do Evento"}</Text>

          {/* Informações Rápidas */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <View>
                <Text style={styles.infoLabel}>Data e Hora</Text>
                <Text style={styles.infoValue}>
                  {event?.data || "Não informada"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={primaryColor}
                />
              </View>
              <View>
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>
                  {event?.local || "Local não definido"}
                </Text>
              </View>
            </View>
          </View>

          {/* Descrição */}
          <Text style={styles.sectionTitle}>Sobre o evento</Text>
          <Text style={styles.description}>
            Esta é a descrição detalhada do evento de ID {id}. Aqui você pode
            colocar todas as informações sobre atrações, cronograma, regras e
            detalhes importantes que o usuário precisa saber antes de
            participar.
          </Text>
        </View>
      </ScrollView>

      {/* Botão Fixo na parte inferior */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: noCarrinho ? "#34C759" : primaryColor },
          ]}
          onPress={async () => {
            if (noCarrinho) {
              router.push("/(drawn)/cart");
              return;
            }
            await adicionarItem({
              id: id as string,
              titulo: event?.titulo as string,
              local: event?.local as string,
              imagem: event?.imagem as string,
              data: event?.data as string,
              preco: event?.preco as string,
            });
            Alert.alert(
              "Adicionado!",
              `"${event?.titulo}" foi adicionado ao carrinho.`,
              [
                {
                  text: "Ver Carrinho",
                  onPress: () => router.push("/(drawn)/cart"),
                },
                { text: "Continuar", style: "cancel" },
              ],
            );
          }}
        >
          <Text style={styles.buttonText}>
            {noCarrinho ? "Ver no Carrinho" : "Garantir Ingresso"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  coverImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
    paddingBottom: 40, // Espaço para o botão fixo
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#fbfbfd",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#e6f2ff", // Fundo azul bem claro
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 13,
    color: "#8e8e93",
    fontWeight: "600",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#1c1c1e",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#3a3a3c",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e5e5ea",
    // Sombras para dar destaque ao rodapé
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    width: "100%",
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
