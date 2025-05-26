import { v } from "convex/values";
import { mutation, query } from "../_generated/server";


export const addComment =  mutation({
  args:{
    content: v.string(),
    postId: v.id("posts")
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();;
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first();

    if (!currentUser) throw new Error("User not found.");
    
    const post =  await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found.");

    const commentId = await ctx.db.insert("comments", {
      userId: currentUser._id,
      postId: args.postId,
      content: args.content,
    });
    
    await ctx.db.patch(args.postId, {comments: post.comments + 1});

    return commentId;
  }
});

export const getComments = query({
  args: {
    postId: v.id("posts")
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const currentUser = await ctx.db.query("users").withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject)
    ).first();

    if (!currentUser) throw new Error("User not found.");

    const comments = await ctx.db.query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();



    const commentsWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            fullname: user!.fullname,
            image: user!.image,
          },
        };
      })
    );

    return commentsWithInfo;
  }
})