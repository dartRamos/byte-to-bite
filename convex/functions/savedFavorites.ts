import { v } from 'convex/values';
import { mutation } from '../_generated/server';

export const insertSavedRecipe = mutation({
  args: { 
    recipeId: v.number(), 
    title: v.string(),
    imageUrl: v.string(),
    isFavorited: v.boolean()
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized.");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found.");

    const existingSavedRecipe = await ctx.db
      .query("savedRecipes")
      .withIndex("by_recipeId_and_userId", (q) =>
        q.eq("recipeId", args.recipeId).eq("userId", currentUser._id)
      )
      .unique();

    if (existingSavedRecipe) {
      return existingSavedRecipe;
    }

    const savedRecipeId = await ctx.db.insert("savedRecipes", {
      userId: currentUser._id,
      recipeId: args.recipeId,
      title: args.title,
      imageUrl: args.imageUrl,
      isFavorited: args.isFavorited
    });

    return savedRecipeId;
  }
});
