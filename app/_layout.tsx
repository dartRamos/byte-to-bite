import ClerkAndConvexProviders from "@/providers/ClerkAndConvexProviders";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <ClerkAndConvexProviders>
        
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      
      </ClerkAndConvexProviders>
    </FavoritesProvider>
  );
}