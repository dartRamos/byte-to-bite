import InitialLayout from "../components/InitialLayout";
import ClerkAndConvexProviders from "@/provides/ClerkAndConvexProviders";
import { ClerkProvider } from "@clerk/clerk-expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (

    // Clerk and Convex providers are used to manage authentication and data fetching
    <ClerkAndConvexProviders>
      {/* Stops content from going under the status bar */}
      <SafeAreaProvider>
        {/* Uses expo-router to manage navigation */}
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProviders>


  );
}