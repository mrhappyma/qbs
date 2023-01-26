import { Team } from "@prisma/client";

declare type createTeamResponse = {
  data:
    | { status: "unauthorized" | "error" }
    | {
        status: "ok";
        id: string;
      };
};

declare type fetchTeamResponse = {
  data:
    | { status: "unauthorized" | "error" | "not-found" | "forbidden" }
    | {
        status: "ok";
        team: Team;
      };
};

declare type updateTeamResponse = {
  data:
    | { status: "unauthorized" | "error" | "not-found" | "forbidden" }
    | {
        status: "ok";
        team: Team;
      };
};

declare type minimalTeamData = {
  id: string;
  name: string;
  numberOfMatches: number;
  lastUpdated: string;
};

declare type listTeamResponse = {
  data:
    | { status: "unauthorized" | "error" }
    | {
        status: "ok";
        teams: minimalTeamData[];
      };
};
