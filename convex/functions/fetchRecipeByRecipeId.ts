// import { action } from "../_generated/server";


// export const fetchRecipeById = action(async (ctx, { recipeId }: { recipeId: number}) => {
//   if (!recipeId) {
//     throw new Error("No recipe found.")
//   }

//   const API_KEY = (ctx as ActionCtx).env.SPOONACULAR_API_KEY;
//   const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;

//   const res = await fetch(url);

//   if(!res.ok) {
//     throw new Error(`API rror: ${res.status} ${res.statusText}`);
//   }

//   return await res.json();
// });