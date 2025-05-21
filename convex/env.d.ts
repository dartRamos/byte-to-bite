typescript
// convex/env.d.ts
import type { DataModel } from "./_generated/dataModel";
import type { Env } from "./config";

declare module "convex/server" {
  interface ActionCtx extends GenericActionCtx<DataModel> {
    env: Env;
  }
  interface QueryCtx extends GenericQueryCtx<DataModel> {
    env: Env;
  }
  interface MutationCtx extends GenericMutationCtx<DataModel> {
    env: Env;
  }
}