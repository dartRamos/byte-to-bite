import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

type FavoritesContextType = {
  favorites: number[];
  toggleFavorite: (recipeId: number, title: string, imageUrl: string) => void;
  isFavorite: (recipeId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

type FavoritesProviderProps = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
  const { user } = useUser();

  const convexUser = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : 'skip'
  );

  const savedFavorites = useQuery(
    api.functions.getFavoriteByUser.getFavoritesByUser,
    convexUser?._id ? { userId: convexUser._id } : 'skip'
  );

  const insertSavedRecipe = useMutation(api.functions.savedFavorites.insertSavedRecipe);
  const removeSavedRecipe = useMutation(api.functions.savedFavorites.removeSavedRecipe);

  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (savedFavorites) {
      setFavorites(savedFavorites.map((fav: any) => fav.recipeId));
    }
  }, [savedFavorites]);

  const toggleFavorite = async (recipeId: number, title: string, imageUrl: string) => {
    if (!convexUser?._id) return;

    try {
      if (favorites.includes(recipeId)) {
        await removeSavedRecipe({ userId: convexUser._id, recipeId });
        setFavorites((prev) => prev.filter((id) => id !== recipeId));
      } else {
        await insertSavedRecipe({
          userId: convexUser._id,
          recipeId,
          title,
          imageUrl,
          isFavorited: true,
        });
        setFavorites((prev) => [...prev, recipeId]);
      }
    } catch (error) {
      console.error('Failed to update favorite in DB:', error);
    }
  };

  const isFavorite = (recipeId: number) => favorites.includes(recipeId);

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
