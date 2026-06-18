import { ScrollView } from "react-native";
import ProfileScreen from "./app/(drawer)/profile";
import HomeScreen from "./app/(drawer)/home";

export default function App() {
  let telaAtual = "home";

  if (telaAtual === "home") {
    return (
      <>
        <HomeScreen />
      </>
    );
  }

  if (telaAtual === "profile") {
    return (
      <>
        <ProfileScreen />
      </>
    );
  }

}