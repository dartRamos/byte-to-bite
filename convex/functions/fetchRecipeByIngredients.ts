import { action } from "../_generated/server";
import { v } from "convex/values";

export const fetchRecipes = action({
  args: {
    items: v.array(v.string())
  },
  handler: async (ctx, { items }) => {

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) throw new Error("Missing API key");
    if (!items.length) throw new Error("No ingredients provided");

    const url = `https://api.spoonacular.com/recipes/findByIngredients?` + 
      new URLSearchParams({
        ingredients: items.join(","),
        apiKey: apiKey
      });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  }
});