import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const insertSavedRecipe = mutation({
  args: { 
    userId: v.id("users"), 
    recipeId: v.number(), 
    title: v.string(),
    imageUrl: v.string(),
    isFavorited: v.boolean()
  },

  handler: async (ctx, args) => { // ctx = context

    // checks if reciped is already saved
    const existingSavedRecipe = await ctx.db
    .query("savedRecipes")
    .withIndex("by_recipeId_and_userId", (q) => 
    q.eq("recipeId", args.recipeId).eq("userId", args.userId))
    .unique();

    await ctx.auth.getUserIdentity();

    // if reciped is saved just return recipe
    if(existingSavedRecipe) return

    await ctx.db.insert("savedRecipes", {
      userId: args.userId,
      recipeId: args.recipeId,
      title: args.title,
      imageUrl: args.imageUrl,
      isFavorited: args.isFavorited
    });
  }
});