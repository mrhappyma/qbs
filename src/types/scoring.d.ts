declare type matchScoreEvent = {
  type: matchScoreEventType.add;
  team: number;
  score: number;
};

declare type matchScore = {
  events: matchScoreEvent[];
};

declare type fetchMatchScoreResponse = {
  data: { status: "error" | "not-found" } | { status: "ok"; score: matchScore };
};

declare type addMatchScoreEventResponse = {
  data: { status: "error" | "not-found" | "forbidden" | "unauthorized" | "ok" };
};

declare type undoLastMatchScoreEventResponse = {
  data: { status: "error" | "not-found" | "forbidden" | "unauthorized" | "ok" };
};

declare type overrideMatchScoreResponse = {
  data: { status: "error" | "not-found" | "forbidden" | "unauthorized" | "ok" };
};
