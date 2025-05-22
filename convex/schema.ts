import { defineSchema, defineTable } from 'convex/server';
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(), // HiDro
    fullName: v.string(), // Dro Ramos
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
  }).index("by_recipeId_and_userId", ["recipeId", "userId"]),

  posts: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id('_storage'),
    caption: v.optional(v.string()),
    rating: v.number()
  }).index("by_user", ["userId"])
})