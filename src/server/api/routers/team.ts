import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import type {
  createTeamResponse,
  fetchTeamResponse,
  listTeamResponse,
  updateTeamResponse,
} from "../../../types/teamApiResponses";

export const teamRouter = createTRPCRouter({
  create: protectedProcedure.query(
    async ({ ctx }): Promise<createTeamResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const initialName = uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        separator: " ",
        style: "capital",
      });

      let record;
      try {
        record = await ctx.prisma.team.create({
          data: {
            userId: ctx.session.user.id,
            name: initialName + "s",
            createdAt: new Date().toString(),
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
          id: record.id,
        },
      };
    }
  ),
  fetch: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }): Promise<fetchTeamResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const record = await ctx.prisma.team.findUnique({
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

      if (record.userId != ctx.session.user.id)
        return {
          data: {
            status: "forbidden",
          },
        };

      return {
        data: {
          status: "ok",
          team: record,
        },
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        logoUrl: z.string().optional(),
        color1: z.string().optional(),
        color2: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }): Promise<updateTeamResponse> => {
      if (!ctx.session)
        return {
          data: {
            status: "unauthorized",
          },
        };

      const record = await ctx.prisma.team.findUnique({
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
      if (record.userId != ctx.session.user.id)
        return {
          data: {
            status: "forbidden",
          },
        };
      let update;
      try {
        update = await ctx.prisma.team.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            logoUrl: input.logoUrl,
            color1: input.color1,
            color2: input.color2,
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
          team: update,
        },
      };
    }),
  list: protectedProcedure.query(async ({ ctx }): Promise<listTeamResponse> => {
    if (!ctx.session)
      return {
        data: {
          status: "unauthorized",
        },
      };

    const list = await ctx.prisma.team.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        MatchesAsTeam1: true,
        MatchesAsTeam2: true,
        updatedAt: true,
      },
    });

    return {
      data: {
        status: "ok",
        teams: list.map((item) => ({
          id: item.id,
          name: item.name,
          lastUpdated: item.updatedAt,
          numberOfMatches:
            item.MatchesAsTeam1.length + item.MatchesAsTeam1.length,
        })),
      },
    };
  }),
});
