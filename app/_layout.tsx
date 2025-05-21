import ClerkAndConvexProviders from "@/provides/ClerkAndConvexProviders";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "../components/InitialLayout";

export default function RootLayout() {
  return (
    <ClerkAndConvexProviders>
      
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    
    </ClerkAndConvexProviders>
  );
}