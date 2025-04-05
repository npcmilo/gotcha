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
import type * as images from "../images.js";
import type * as levels from "../levels.js";
import type * as migration from "../migration.js";
import type * as models_airtable from "../models/airtable.js";
import type * as models_migration from "../models/migration.js";
import type * as models_storage from "../models/storage.js";
import type * as storage from "../storage.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  images: typeof images;
  levels: typeof levels;
  migration: typeof migration;
  "models/airtable": typeof models_airtable;
  "models/migration": typeof models_migration;
  "models/storage": typeof models_storage;
  storage: typeof storage;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
