import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Bolão Copa 2026",
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#F8FAF7', // Fundo Claro
        },
        headerTintColor: '#111827', // Texto Principal
        drawerActiveTintColor: '#15803D', // Verde Principal
        drawerStyle: {
          backgroundColor: '#FFFFFF', // Branco
        },
      }}
    >
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Início',
          title: 'Início',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="partidas"
        options={{
          drawerLabel: 'Partidas',
          title: 'Partidas',
          drawerIcon: ({ color, size }) => <Ionicons name="football-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="palpites"
        options={{
          drawerLabel: 'Meus Palpites',
          title: 'Meus Palpites',
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="ranking"
        options={{
          drawerLabel: 'Ranking',
          title: 'Ranking',
          drawerIcon: ({ color, size }) => <Ionicons name="trophy-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="usuario"
        options={{
          drawerLabel: 'Minha Conta',
          title: 'Minha Conta',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />

      <Drawer.Screen
        name="fazerPalpite"
        options={{
          title: 'Fazer Palpite',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="editarPalpite"
        options={{
          title: 'Editar Palpite',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="editarUsuario"
        options={{
          title: 'Editar Perfil',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="detalhesPartida"
        options={{
          title: 'Detalhes da Partida',
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer>
  );
}