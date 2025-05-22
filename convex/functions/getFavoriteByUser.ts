import { query } from '../_generated/server';
import { v } from 'convex/values';

export const getFavoritesByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("savedRecipes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();
  }
});