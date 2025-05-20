import type {
  GenericActionCtx,
  GenericQueryCtx,
  GenericMutationCtx
} from "convex/server";
import type { DataModel } from "./_generated/dataModel";

export interface Env {
  SPOONACULAR_API_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
}

// Use DataModel consistently in all context types:
export type ActionCtx = GenericActionCtx<DataModel> & { env: Env };
export type QueryCtx = GenericQueryCtx<DataModel> & { env: Env };
export type MutationCtx = GenericMutationCtx<DataModel> & { env: Env };