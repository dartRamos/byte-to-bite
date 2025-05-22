import React, { createContext, ReactNode, useContext, useState } from 'react';

// Use number[] for favorites since recipe IDs are numbers
type FavoritesContextType = {
  favorites: number[]; // Array of favorite recipe IDs (numbers)
  toggleFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<number[]>([]); // <-- number[] here

  const toggleFavorite = (recipeId: number) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)  // remove number
        : [...prev, recipeId]                    // add number
    );
  };

  const isFavorite = (recipeId: number) => favorites.includes(recipeId); // <-- expect number here

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};