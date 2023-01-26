import type { Match } from "@prisma/client";

declare type createMatchResponse = {
  data:
    | { status: "unauthorized" | "error" }
    | {
        status: "ok";
        id: string;
      };
};

declare type fetchMatchResponse = {
  data:
    | { status: "error" | "not-found" }
    | {
        status: "ok";
        match: Match & {
          Team1: Team | null;
          Team2: Team | null;
        };
      };
};

declare type updateMatchDetailsResponse = {
  data:
    | { status: "unauthorized" | "error" | "not-found" | "forbidden" }
    | {
        status: "ok";
        match: Match;
      };
};

declare type minimalMatchData = {
  id: string;
  name: string;
  team1Name: string?;
  team2Name: string?;
  updatedAt: string;
};

declare type listMatchResponse = {
  data:
    | { status: "unauthorized" | "error" }
    | {
        status: "ok";
        matches: minimalMatchData[];
      };
};
