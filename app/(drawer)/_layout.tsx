import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

// Importando telas
import HomeScreen from './home';
import PerfilScreen from './profile';
import PalpitesScreen from './palpites';
import FazerPalpiteScreen from './fazerPalpite';
import EditarPalpiteScreen from './editarPalpite';
import PartidasScreen from './partidas';
import RankingScreen from './ranking';
import UsuarioScreen from './usuario';
import EditarUsuarioScreen from './editarUsuario';
import LoginScreen from './login';
import CriarContaScreen from './criarConta';
import RecuperarContaScreen from './recuperarConta';

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Perfil" component={PerfilScreen} />
      <Drawer.Screen name="Palpites" component={PalpitesScreen} />
      <Drawer.Screen name="Fazer Palpite" component={FazerPalpiteScreen} />
      <Drawer.Screen name="Editar Palpite" component={EditarPalpiteScreen} />
      <Drawer.Screen name="Partidas" component={PartidasScreen} />
      <Drawer.Screen name="Ranking" component={RankingScreen} />
      <Drawer.Screen name="Usuário" component={UsuarioScreen} />
      <Drawer.Screen name="Editar Usuário" component={EditarUsuarioScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Criar Conta" component={CriarContaScreen} />
      <Drawer.Screen name="Recuperar Conta" component={RecuperarContaScreen} />
    </Drawer.Navigator>
  );
}
