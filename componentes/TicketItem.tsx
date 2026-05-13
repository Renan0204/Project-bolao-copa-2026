import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { DADOS_EVENTOS } from '../mocks/event';
import { Ticket } from '../types/ticket';
import InfoRow from './InfoRow';

const primaryColor = '#007AFF';

type TicketItemProps = {
  item: Ticket;
};

export default function TicketItem({ item }: TicketItemProps) {
  const evento = DADOS_EVENTOS.find((e) => e.id === item.eventoId);

  if (!evento) return null;

  return (
    <View style={styles.card}>
      <View style={styles.faixaLateral} />
      <Image source={{ uri: evento.imagem }} style={styles.imagemCard} />
      <View style={styles.infoCard}>
        <Text style={styles.tituloCard} numberOfLines={2}>{evento.titulo}</Text>
        <InfoRow iconName="calendar-outline" text={evento.data} iconSize={13} />
        <InfoRow iconName="location-outline" text={evento.local} iconSize={13} />
        <View style={styles.separador} />
        <View style={styles.linhaCodigo}>
          <Ionicons name="ticket-outline" size={14} color={primaryColor} />
          <Text style={styles.textoCodigo}>{item.codigo}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  faixaLateral: {
    width: 5,
    backgroundColor: primaryColor,
  },
  imagemCard: {
    width: 85,
    height: 115,
    resizeMode: 'cover',
  },
  infoCard: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  tituloCard: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  separador: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  linhaCodigo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  textoCodigo: {
    fontSize: 13,
    fontWeight: '700',
    color: primaryColor,
    letterSpacing: 1,
  },
  linhaAcoes: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  textoBotaoAcao: {
    fontSize: 11,
    color: primaryColor,
    fontWeight: '600',
  },
});
