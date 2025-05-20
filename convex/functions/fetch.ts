import { action } from "../_generated/server";
import type { ActionCtx } from "../config";

export const fetchRecipes = action(async (ctx, { items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    throw new Error("No ingredients provided");
  }

  const API_KEY = (ctx as ActionCtx).env.SPOONACULAR_API_KEY;
  const ingredientsString = items.join(",");
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
    ingredientsString
  )}&apiKey=${API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
});

export const fetchRecipeDetails = action(async (ctx, { recipeId }: { recipeId: number }) => {
  if (!recipeId) {
    throw new Error("No recipe ID provided");
  }

  const API_KEY = (ctx as ActionCtx).env.SPOONACULAR_API_KEY;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
});
