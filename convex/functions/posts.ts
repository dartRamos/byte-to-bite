import { mutation, query } from "../_generated/server"
import { v } from "convex/values"

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
})

export const createPost = mutation({
  args:{
    caption: v.optional(v.string()),
    storageId: v.id("_storage")
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first()

    if(!currentUser) throw new Error("User not found");

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    if (!imageUrl) throw new Error("Image not found");

    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      imageUrl,
      storageId: args.storageId,
      caption: args.caption,
    });

    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1
    });

    return postId;
  },
});

export const getFeedPost= query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first();

    // get all posts
    const posts = await ctx.db.query("posts",).order("desc").collect();

    if(posts.length === 0) return [];

    return posts;
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts")
  },

  handler: async(ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) {
      throw new Error("User not found.");
    }

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found.");

    if (post.userId !== currentUser._id) {
      throw new Error("Not authorized to delete this post.");
    }

    // delete the storage file
    await ctx.storage.delete(post.storageId);

    // delete the post 
    await ctx.db.delete(args.postId);
    
    // decrement user's post count by 1 (can only ever reach 0)
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1)
    });
  }
});