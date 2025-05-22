import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types of the data and functions our context will provide
type FavoritesContextType = {
  favorites: string[]; // Array of favorite recipe IDs
  toggleFavorite: (recipeId: string) => void;  // Function to add/remove a recipe ID from favorites
  isFavorite: (recipeId: string) => boolean;   // Function to check if a recipe is in favorites
};

// Create the context with an initial undefined value
// This helps us catch errors if used outside a provider
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Define the props for the provider component
// 'children' means any nested components inside this provider
type FavoritesProviderProps = {
  children: ReactNode;
};


// The provider component that wraps the app (or part of it)
// This manages the favorites state and provides functions to update it
export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {

  // State holding an array of recipe IDs marked as favorite
  const [favorites, setFavorites] = useState<string[]>([]);

  // Function to toggle favorite status for a given recipe ID
  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)   // Remove if already favorited
        : [...prev, recipeId]                     // Add if not favorited
    );
  };

  // Check if a specific recipe ID is in favorites
  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  return (
    // Provide the favorites data and functions to all children components
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};



// Custom hook to access favorites context in any component
// Throws an error if used outside the FavoritesProvider
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};