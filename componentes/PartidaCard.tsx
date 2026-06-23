// componentes/PartidaCard.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Partida } from '../types/partida';

type PartidaCardProps = {
  partida: Partida;
  destaque?: boolean;
  onPress: () => void;
};

function normalizarStatus(status: string) {
  return status?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() || "";
}

function formatarData(dataHora: string) {
  if (!dataHora) return "Data não informada";
  const data = new Date(dataHora);
  return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function PartidaCard({ partida, destaque = false, onPress }: PartidaCardProps) {
  const statusNormalizado = normalizarStatus(partida.status);
  const emAndamento = statusNormalizado.includes("andamento");
  const finalizada = statusNormalizado.includes("finalizad");

  const mostrarPlacar = emAndamento || finalizada;

  const golsA = partida.golsSelecaoA ?? "-";
  const golsB = partida.golsSelecaoB ?? "-";

  let textoBotao = "palpitar";
  if (finalizada) {
    textoBotao = "encerrado";
  } else if (emAndamento) {
    textoBotao = "detalhes";
  }

  const renderBandeiras = () => (
    <View style={styles.flagsRow}>
      {partida.selecaoABandeiraUrl ? (
        <Image source={{ uri: partida.selecaoABandeiraUrl }} style={styles.flag} />
      ) : (
        <View style={styles.flagPlaceholder} />
      )}

      {partida.selecaoBBandeiraUrl ? (
        <Image source={{ uri: partida.selecaoBBandeiraUrl }} style={styles.flag} />
      ) : (
        <View style={styles.flagPlaceholder} />
      )}
    </View>
  );

  return (
    <View style={destaque ? styles.featuredContainer : styles.smallContainer}>
      <View style={destaque ? styles.featuredCard : styles.smallCard}>
        {destaque && emAndamento && (
          <Text style={styles.statusEmAndamento}>Em andamento</Text>
        )}

        {renderBandeiras()}

        {mostrarPlacar ? (
          <Text style={destaque ? styles.matchText : styles.smallMatchText}>
            {partida.selecaoA}  <Text style={styles.scoreText}>{golsA}</Text> x <Text style={styles.scoreText}>{golsB}</Text>  {partida.selecaoB}
          </Text>
        ) : (
          <Text style={destaque ? styles.matchText : styles.smallMatchText}>
            {partida.selecaoA} x {partida.selecaoB}
          </Text>
        )}

        <Text style={styles.dateText}>{formatarData(partida.dataHora)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.palpitarButton, finalizada && styles.palpitarButtonDisabled]}
        onPress={onPress}
        disabled={finalizada}
      >
        <Text style={[styles.palpitarText, finalizada && styles.palpitarTextDisabled]}>
          {textoBotao}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  featuredContainer: {
    marginBottom: 20,
    width: "100%",
  },
  featuredCard: {
    minHeight: 125,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 6,
  },
  statusEmAndamento: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#15803D",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  matchText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },
  scoreText: {
    color: "#15803D",
    fontWeight: "bold",
  },
  dateText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
  smallContainer: {
    width: "48%",
    marginBottom: 15,
  },
  smallCard: {
    height: 140,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 6,
  },
  smallMatchText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 5,
    color: "#111827",
  },
  palpitarButton: {
    backgroundColor: "#15803D",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#15803D",
  },
  palpitarButtonDisabled: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
  },
  palpitarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  palpitarTextDisabled: {
    color: "#9CA3AF",
  },
  flagsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  flag: {
    width: 40,
    height: 28,
    resizeMode: "contain",
    borderRadius: 4,
    marginHorizontal: 5,
  },
  flagPlaceholder: {
    width: 40,
    height: 28,
    backgroundColor: "#D1D5DB",
    borderRadius: 4,
    marginHorizontal: 5,
  },
});