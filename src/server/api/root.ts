import { createTRPCRouter } from "./trpc";
import { teamRouter } from "./routers/team";
import { matchRouter } from "./routers/match";
import { scoringRouter } from "./routers/scoring";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  team: teamRouter,
  match: matchRouter,
  scoring: scoringRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
