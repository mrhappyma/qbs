import { z } from "zod";
import { matchScoreEventType } from "../../../utils/enums";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const scoringRouter = createTRPCRouter({
  fetch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }): Promise<fetchMatchScoreResponse> => {
      const record = await ctx.prisma.match.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!record)
        return {
          data: {
            status: "not-found",
          },
        };

      if (!record.scores) {
        const blankScore = {
          events: [],
        };

        await ctx.prisma.match.update({
          where: {
            id: input.id,
          },
          data: {
            scores: JSON.stringify(blankScore),
          },
        });
      }

      return {
        data: {
          status: "ok",
          score: JSON.parse(record.scores),
        },
      };
    }),
  addAddEvent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        team: z.number().min(1).max(2),
        score: z.number(),
      })
    )
    .query(async ({ input, ctx }): Promise<addMatchScoreEventResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const record = await ctx.prisma.match.findUnique({
        where: {
          id: input.id,
        },
        include: {
          scorers: true,
        },
      });

      if (!record)
        return {
          data: {
            status: "not-found",
          },
        };

      if (
        ctx.session.user.id != record.userId &&
        !record.scorers.some((user) => user.id == ctx.session.user.id)
      )
        return {
          data: {
            status: "forbidden",
          },
        };

      const scores: matchScore = JSON.parse(record.scores);
      scores.events.push({
        type: matchScoreEventType.add,
        team: input.team,
        score: input.score,
      });

      await ctx.prisma.match.update({
        where: {
          id: input.id,
        },
        data: {
          scores: JSON.stringify(scores),
        },
      });

      return {
        data: {
          status: "ok",
        },
      };
    }),
  undoLastEvent: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        team: z.number().min(1).max(2),
      })
    )
    .query(async ({ input, ctx }): Promise<undoLastMatchScoreEventResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const record = await ctx.prisma.match.findUnique({
        where: {
          id: input.id,
        },
        include: {
          scorers: true,
        },
      });

      if (!record)
        return {
          data: {
            status: "not-found",
          },
        };
      if (
        ctx.session.user.id != record.userId &&
        !record.scorers.some((user) => user.id == ctx.session.user.id)
      )
        return {
          data: {
            status: "forbidden",
          },
        };
      const scores: matchScore = JSON.parse(record.scores);
      scores.events.splice(-1, 1);

      await ctx.prisma.match.update({
        where: {
          id: input.id,
        },
        data: {
          scores: JSON.stringify(scores),
        },
      });
      return {
        data: {
          status: "ok",
        },
      };
    }),
});
