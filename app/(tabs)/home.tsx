import { useRouter } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../../componentes/EventCard';
import { DADOS_EVENTOS } from '../../mocks/event';
import { Event } from '../../types/event';
import { buscarEventos } from '../../services/eventService';
import {  useEffect, useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const renderizarEvento = ({ item }: { item: Event }) => (
    <EventCard
      item={item}
      onPress={() => router.push(`event/${item.id}`)}
    />
  );

  async function carregarEventos() {
    setCarregando(true);
    
    const resultadoBusca = await buscarEventos();

    setCarregando(false);

    setEvents(resultadoBusca);
  }

  // Quando a tela for carregada
  useEffect(() => {
    carregarEventos()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Descubra Eventos</Text>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar eventos, shows, cursos..."
          placeholderTextColor="#999"
        />
      </View>

      {
        carregando && (
          <ActivityIndicator 
            size={"large"}
            color={"#007ADD"}
          />
        )
      }

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderizarEvento}
        contentContainerStyle={styles.listaContainer}
        showsVerticalScrollIndicator={false}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  inputBusca: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  listaContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loading: {
    marginTop: 60
  }
});