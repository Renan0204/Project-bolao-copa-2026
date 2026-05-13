import { Tabs } from 'expo-router';
// 1. Importando a coleção FontAwesome do pacote vector-icons
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Instalação do pacote de ícones (rodar no terminal):
// npx expo install @expo/vector-icons -- --legacy-peer-deps

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        tabBarActiveTintColor: '#007AFF', // Cor do ícone/texto quando a aba está selecionada
        tabBarInactiveTintColor: '#8e8e93', // Cor quando a aba não está selecionada (opcional)
        headerShown: false, // Esconde o cabeçalho global para todas as telas dentro das abas
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          // 2. Adicionando o ícone usando uma função que recebe a cor atual (ativa/inativa)
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Bilhetes',
          tabBarIcon: ({ color }) => <FontAwesome name="ticket" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          // 3. Ícone diferente para a aba de perfil
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}