import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const toggleBookmark = mutation({
  args: {postId: v.id("posts")},

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first();

    if (!currentUser) throw new Error("User not found.");
    
    const existing = await ctx.db
    .query("bookmarks")
    .withIndex("by_user_and_post", (q) =>
      q.eq("userId", currentUser._id).eq("postId", args.postId)
    ).first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Bookmark removed
    } else {
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId: args.postId,
      });
      return true; // Bookmark added
    }
  }
})

export const getBookmarkedPosts = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first();

    if (!currentUser) throw new Error("User not found.");


    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();

      const bookmarksWithInfo = await Promise.all(
        bookmarks.map(async (bookmark) => {
          const post = await ctx.db.get(bookmark.postId);
          return post;
        })
      );

      return bookmarksWithInfo;
  },
});