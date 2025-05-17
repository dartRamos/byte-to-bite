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
import type * as functions_fetch from "../functions/fetch.js";
import type * as functions_savedFavorites from "../functions/savedFavorites.js";
import type * as functions_userIngredients from "../functions/userIngredients.js";
import type * as functions_users from "../functions/users.js";
import type * as http from "../http.js";

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
  "functions/fetch": typeof functions_fetch;
  "functions/savedFavorites": typeof functions_savedFavorites;
  "functions/userIngredients": typeof functions_userIngredients;
  "functions/users": typeof functions_users;
  http: typeof http;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
