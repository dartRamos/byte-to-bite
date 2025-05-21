import { ClerkProvider, useAuth, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {ConvexReactClient} from "convex/react";


export const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, { unsavedChangesWarning: false,}
); 

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    'Missing Publishable key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env.local'
  )
}


export default function ClerkAndConvexProviders({children}: {children: React.ReactNode}) {
  return (
    // The ClerkProvider component is used to manage authentication and user sessions. It uses the tokenCache to store the user's session token.
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      {/* The ConvexProviderWithClerk component is used to manage data fetching and state management. It uses the useAuth hook from Clerk to manage user sessions and the ConvexReactClient to fetch data from the Convex server. */}
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* The ClerkLoaded component is used to ensure that the app only renders after the user's session has been loaded. */}
        <ClerkLoaded>{children}</ClerkLoaded>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

console.log("CONVEX URL:", process.env.EXPO_PUBLIC_CONVEX_URL);