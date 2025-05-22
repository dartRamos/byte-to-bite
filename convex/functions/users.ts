import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

// Create user mutation
export const createUser = mutation({
  args: {
    username: v.string(),
    fullName: v.string(),
    email: v.string(),
    image: v.string(),
    clerkId: v.string(),
    hasSeenWelcome: v.boolean(),
    posts: v.number()
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) return;

    await ctx.db.insert("users", {
      username: args.username,
      fullName: args.fullName,
      email: args.email,
      image: args.image,
      clerkId: args.clerkId,
      posts: args.posts
    });
  },
});

// user by clerk id
export const getUserByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});
