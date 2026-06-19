import { Stack } from "expo-router";
import { CartProvider } from "../contexts/CartContext";

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="event/[id]" />
      </Stack>
    </CartProvider>
  );
}
