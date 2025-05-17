import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const insertUserIngredient = mutation({
  args: { 
    userId: v.id("users"), 
    ingredientName: v.string(), 
    isPantryStaple: v.boolean()
  },

  handler: async (ctx, args) => { // ctx = context

    // checks if ingredient exists
    const existingIngredient = await ctx.db
    .query("userIngredients")
    .withIndex("by_user_and_ingredient", (q) => 
    q.eq("userId", args.userId).eq("ingredientName", args.ingredientName))
    .unique();

    await ctx.auth.getUserIdentity();

    // if ingredient exists just return ingredient
    if(existingIngredient) return

    await ctx.db.insert("userIngredients", {
      userId: args.userId,
      ingredientName: args.ingredientName,
      isPantryStaple: args.isPantryStaple,
    });
  }
});