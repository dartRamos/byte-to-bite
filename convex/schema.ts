import { defineSchema, defineTable } from 'convex/server';
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(), // HiDro
    fullname: v.string(), // Dro Ramos
    email: v.string(),
    image: v.string(), // Comes with login in via email
    clerkId: v.string(),
    posts: v.number()
  }).index("by_clerk_id", ["clerkId"]),

  userIngredients: defineTable({
    userId: v.id("users"),
    ingredientName: v.string(),
    isPantryStaple: v.boolean()
  }).index("by_userId", ["userId"])
    .index("by_user_and_ingredient", ["userId", "ingredientName"]),

  savedRecipes: defineTable({
    userId: v.id("users"),
    recipeId: v.number(),
    title: v.string(),
    imageUrl: v.string(),
    isFavorited: v.boolean()
  })
    .index("by_recipeId_and_userId", ["recipeId", "userId"])
    .index("by_userId", ["userId"]),

    likes: defineTable({
      userId: v.id("users"),
      postId: v.id("posts"),
    }).index("by_post", ["postId"])
      .index("by_user_and_post", ["userId", "postId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
  }).index("by_post", ["postId"])
    .index("by_user", ["userId"]),

  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id('_storage'),
    caption: v.optional(v.string()),
    title: v.optional(v.string()),
    comments: v.number(),
  }).index("by_user", ["userId"]),

  bookmarks: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
  }).index("by_user_and_post", ["userId", "postId"])
    .index("by_post", ["postId"])
    .index("by_user", ["userId"]),
})