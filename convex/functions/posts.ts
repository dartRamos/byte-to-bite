import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return await ctx.storage.generateUploadUrl();
})

export const createPost = mutation({
  args:{
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
    title: v.optional(v.string()),
    isRecipe: v.boolean()
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
      title: args.title,
      comments: 0,
      likes: 0,
      isRecipe: args.isRecipe
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

    if (!currentUser) {
      throw new Error("User not found.");
    }

    const posts = await ctx.db.query("posts",).order("desc").collect();
    if(posts.length === 0) return [];

    const postsWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;

        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) => 
          q.eq("userId", currentUser._id).eq("postId", post._id))
          .first();
        
        const bookmark = await ctx.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (q) =>
          q.eq("userId", currentUser._id).eq("postId", post._id))
          .first();

          return {
            ...post,
            author: {
              _id: postAuthor._id,
              username: postAuthor.username,
              image: postAuthor.image,
            },
            isLiked: !!like,
            isBookmarked: !!bookmark,
          }
        })
    );

    return postsWithInfo;
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

export const toggleLike = mutation({
  args:{
    postId: v.id("posts")
  },
  handler: async (ctx, args) => {
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

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) => 
      q.eq("userId", currentUser._id).eq("postId", post._id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.postId, { likes: post.likes - 1});
      return false;

    } else {
      
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: post._id,
      });
      await ctx.db.patch(args.postId, { likes: post.likes + 1 });
    }

    return true;
  }
})