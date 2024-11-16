import { createTreasury } from "@/server/api/procedures/create-treasury";
import { getExecution } from "@/server/api/procedures/get-execution";
import { launchExecution } from "@/server/api/procedures/launch-execution";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * Procedures from api/procedures should be added here.
 */
export const appRouter = createTRPCRouter({
  createTreasury,
  getExecution,
  launchExecution,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
