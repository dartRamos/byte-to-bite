import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const createUser = mutation({
  args:{
    username: v.string(), // HiDro
    fullName: v.string(), // Dro Ramos
    email: v.string(),
    image: v.string(), // Comes with login in via email
    clerkId: v.string(),
    hasSeenWelcome: v.boolean()
  },

  handler: async(ctx, args) => {

    // Checks if user exists already
    const existingUser = await ctx.db.query("users").withIndex("by_clerk_id",(q) => q.eq("clerkId", args.clerkId)).first();


    if (existingUser) return

    // Creating user in DB
    await ctx.db.insert("users", {
      username: args.username, 
      fullName: args.fullName,
      email: args.email,
      image: args.image,
      clerkId: args.clerkId,
    })
  }
});