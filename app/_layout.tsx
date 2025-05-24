import ClerkAndConvexProviders from "@/providers/ClerkAndConvexProviders";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { useFonts } from "expo-font";


export default function RootLayout() {
  const [fontLoaded] = useFonts({
    Pencil:require("../assets/fonts/KgTenThousandReasonsAlt-BOrl.ttf"),
  })

  if (!fontLoaded) {
    return null;
  }

  return (
    
      <ClerkAndConvexProviders>
        <FavoritesProvider>
        
          <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
              <InitialLayout />
            </SafeAreaView>
          </SafeAreaProvider>
        </FavoritesProvider>
      
      </ClerkAndConvexProviders>
    
  );
}