import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const insertUserIngredient = mutation({
  args: { 
    ingredientName: v.string(), 
    isPantryStaple: v.boolean()
  },

  handler: async (ctx, args) => { // ctx = context
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unathorized.")

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique()

    if (!currentUser) throw new Error("User not found.")

    const normalizedName = args.ingredientName.trim().toLowerCase();

    // checks if ingredient exists
    const existingIngredients = await ctx.db
    .query("userIngredients")
    .withIndex("by_user_and_ingredient", (q) => 
    q.eq("userId", currentUser._id).eq("ingredientName", normalizedName))
    .collect();

    if (existingIngredients.length > 0) {
      return existingIngredients[0]._id;
    }

    const ingredientId = await ctx.db.insert("userIngredients", {
      userId: currentUser._id,
      ingredientName: normalizedName,
      isPantryStaple: args.isPantryStaple,
    })

    return ingredientId;
  },
});
