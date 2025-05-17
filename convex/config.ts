import type { GenericQueryCtx } from "convex/server";

export interface Env {
  SPOONACULAR_API_KEY: string;
}

// Use {} as a placeholder for your tables if you don’t have any or don't want to specify them now
export type Context = GenericQueryCtx<{}> & {
  env: Env;
};