import type { GenericActionCtx } from "convex/server";
import type { DataModel } from "./convex/_generated/dataModel";

export interface Env {
  SPOONACULAR_API_KEY: string;
  CLERK_WEBHOOK_SECRET: string;
}

export type ActionCtx = GenericActionCtx<DataModel> & { env: Env };