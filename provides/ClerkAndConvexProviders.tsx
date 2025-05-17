import { ClerkProvider, useAuth, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {ConvexReactClient} from "convex/react";

export const convex = new ConvexReactClient(
  process.env.EXPO_PUBLIC_CONVEX_URL!
); // Replace with your Convex server URL

// This component wraps the ClerkProvider and ConvexProviderWithClerk components to provide authentication and data fetching capabilities to the app.
export default function ClerkAndConvexProviders({children}: {children: React.ReactNode}) {
  return (
    // The ClerkProvider component is used to manage authentication and user sessions. It uses the tokenCache to store the user's session token.
    <ClerkProvider tokenCache={tokenCache}>
      {/* The ConvexProviderWithClerk component is used to manage data fetching and state management. It uses the useAuth hook from Clerk to manage user sessions and the ConvexReactClient to fetch data from the Convex server. */}
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* The ClerkLoaded component is used to ensure that the app only renders after the user's session has been loaded. */}
        <ClerkLoaded>{children}</ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}