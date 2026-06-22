import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Palpite } from "../types/palpite";

type PalpiteCardProps = {
  item: Palpite;
  isDisputada: boolean;
  onEdit: (partidaId: number) => void;
};

export default function PalpiteCard({ item, isDisputada, onEdit }: PalpiteCardProps) {
  function obterNomePartida(item: Palpite) {
    const selecaoA = item.partida?.selecaoA ?? "-";
    const selecaoB = item.partida?.selecaoB ?? "-";
    return `${selecaoA} x ${selecaoB}`;
  }

  function obterPlacarPalpite(item: Palpite) {
    return `${item.golsSelecaoA} x ${item.golsSelecaoB}`;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.match}>{obterNomePartida(item)}</Text>

      <Text style={styles.palpite}>
        Seu palpite: {obterPlacarPalpite(item)}
      </Text>

      <Text style={styles.status}>
        Status: {item.partida?.status ?? "Não informado"}
      </Text>

      {isDisputada && (
        <View style={styles.result}>
          <Text style={styles.placar}>
            Placar oficial: {item.partida?.golsSelecaoA ?? "-"} x{" "}
            {item.partida?.golsSelecaoB ?? "-"}
          </Text>

          <Text style={styles.pontos}>+{item.pontos ?? 0} pontos</Text>

          {item.criterioPontuacao && (
            <Text style={styles.criterio}>{item.criterioPontuacao}</Text>
          )}
        </View>
      )}

      {!isDisputada && item.partida?.id && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => onEdit(item.partida!.id!)}
        >
          <Text style={styles.buttonText}>Editar Palpite</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  match: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#111827",
  },
  palpite: {
    fontSize: 16,
    marginBottom: 5,
    color: "#6B7280",
  },
  status: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  result: {
    marginTop: 5,
  },
  placar: {
    fontSize: 14,
    color: "#6B7280",
  },
  pontos: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16A34A",
  },
  criterio: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  button: {
    backgroundColor: "#15803D",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});