import { action } from "../_generated/server";

export const fetchRecipes = action(async (ctx, { items }: { items: string[] }) => {
  if (!items || items.length === 0) {
    throw new Error("No ingredients provided");
  }

  const API_KEY = process.env.SPOONACULAR_API_KEY; // or however you access env vars in your setup
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
