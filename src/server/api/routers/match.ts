import {
  adjectives,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { z } from "zod";
import type {
  createMatchResponse,
  fetchMatchResponse,
  updateMatchDetailsResponse,
  listMatchResponse,
} from "../../../types/matchApiResponses";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const matchRouter = createTRPCRouter({
  create: protectedProcedure.query(
    async ({ ctx }): Promise<createMatchResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const initialName1 = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: " ",
      });
      const initialName2 = uniqueNamesGenerator({
        dictionaries: [adjectives, names],
        separator: " ",
      });
      const initialName = initialName1 + " vs " + initialName2;

      let record;
      try {
        record = await ctx.prisma.match.create({
          data: {
            scores: "",
            userId: ctx.session.user.id,
            name: initialName,
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
          },
        });
      } catch (e) {
        console.log(e);
        return {
          data: {
            status: "error",
          },
        };
      }

      return {
        data: {
          status: "ok",
          id: record.id,
        },
      };
    }
  ),
  fetch: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<fetchMatchResponse> => {
      const record = await ctx.prisma.match.findUnique({
        where: {
          id: input.id,
        },
        include: {
          Team1: true,
          Team2: true,
        },
      });
      if (!record)
        return {
          data: {
            status: "not-found",
          },
        };
      return {
        data: {
          status: "ok",
          match: record,
        },
      };
    }),
  updateDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        team1: z.string().optional(),
        team2: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }): Promise<updateMatchDetailsResponse> => {
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
      });
      if (!record)
        return {
          data: {
            status: "not-found",
          },
        };
      if (record.userId !== ctx.session.user.id)
        return {
          data: {
            status: "unauthorized",
          },
        };
      let update;
      try {
        update = await ctx.prisma.match.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            team1Id: input.team1,
            team2Id: input.team2,
            updatedAt: new Date().toString(),
          },
        });
      } catch {
        return {
          data: {
            status: "error",
          },
        };
      }

      return {
        data: {
          status: "ok",
          match: update,
        },
      };
    }),
  list: protectedProcedure.query(
    async ({ ctx }): Promise<listMatchResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };
      const records = await ctx.prisma.match.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          Team1: true,
          Team2: true,
          updatedAt: true,
        },
      });

      return {
        data: {
          status: "ok",
          matches: records.map((item) => ({
            id: item.id,
            name: item.name,
            team1Name: item.Team1 ? item.Team1.name : null,
            team2Name: item.Team2 ? item.Team2.name : null,
            updatedAt: item.updatedAt,
          })),
        },
      };
    }
  ),
});
