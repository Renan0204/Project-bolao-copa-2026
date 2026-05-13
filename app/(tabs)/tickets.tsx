import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../componentes/EmptyState';
import TicketItem from '../../componentes/TicketItem';
import { DADOS_TICKETS } from '../../mocks/ticket';

export default function TicketsScreen() {
  const totalBilhetes = DADOS_TICKETS.length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Meus Bilhetes</Text>
        <Text style={styles.headerSubtitulo}>
          {totalBilhetes} {totalBilhetes === 1 ? 'bilhete' : 'bilhetes'}
        </Text>
      </View>

      <FlatList
        data={DADOS_TICKETS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketItem item={item} />}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState iconName="ticket-outline" message="Nenhum bilhete encontrado" />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  headerSubtitulo: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  listaContainer: {
    padding: 20,
    paddingBottom: 30,
  },
});
