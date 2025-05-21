import { action } from "../_generated/server";
import { v } from "convex/values";

export const fetchRecipeByRecipeId = action({
  args: {
    id: v.string()
  },
  handler: async (ctx, { id }) => {

    const apiKey = process.env.SPOONACULAR_API_KEY;

    if (!apiKey) throw new Error("Missing API key");
    if (!id) throw new Error("No ID provided");

    const url = `https://api.spoonacular.com/recipes/${id}/information?` +
      new URLSearchParams({
        apiKey: apiKey,
      });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return await res.json();
  }
});