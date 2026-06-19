import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "Bolão Copa 2026",
        headerTitleAlign: 'center',
        drawerActiveTintColor: '#007AFF',
      }}
    >
      <Drawer.Screen
        name="home" // Tem que ser exatamente o nome do arquivo (home.tsx)
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
          drawerItemStyle: { display: 'none' } // Isso esconde a tela do menu lateral
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
      <Drawer.Screen
        name="profile"
        options={{
          drawerItemStyle: { display: 'none' } // Ocultando o profile antigo caso ainda esteja lá
        }}
      />
    </Drawer>
  );
}