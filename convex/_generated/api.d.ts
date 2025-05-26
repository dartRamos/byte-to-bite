/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as config from "../config.js";
import type * as functions_bookmarks from "../functions/bookmarks.js";
import type * as functions_comments from "../functions/comments.js";
import type * as functions_fetchRecipeByIngredients from "../functions/fetchRecipeByIngredients.js";
import type * as functions_fetchRecipeByRecipeId from "../functions/fetchRecipeByRecipeId.js";
import type * as functions_getFavoriteByUser from "../functions/getFavoriteByUser.js";
import type * as functions_posts from "../functions/posts.js";
import type * as functions_savedFavorites from "../functions/savedFavorites.js";
import type * as functions_userIngredients from "../functions/userIngredients.js";
import type * as http from "../http.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  config: typeof config;
  "functions/bookmarks": typeof functions_bookmarks;
  "functions/comments": typeof functions_comments;
  "functions/fetchRecipeByIngredients": typeof functions_fetchRecipeByIngredients;
  "functions/fetchRecipeByRecipeId": typeof functions_fetchRecipeByRecipeId;
  "functions/getFavoriteByUser": typeof functions_getFavoriteByUser;
  "functions/posts": typeof functions_posts;
  "functions/savedFavorites": typeof functions_savedFavorites;
  "functions/userIngredients": typeof functions_userIngredients;
  http: typeof http;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
