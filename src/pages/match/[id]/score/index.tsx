import type { Match, Team } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import type { ParsedUrlQuery } from "querystring";
import { appRouter } from "../../../../server/api/root";
import { api } from "../../../../utils/api";
import MatchScoreButtons from "../../../../components/matchScoreButtons";
import { useState } from "react";
import Link from "next/link";
import Header from "../../../../components/header";
import { prisma } from "../../../../server/db";
import MinimalScoreBox from "../../../../components/minimalScoreBox";

const ScoreMatch: NextPage<{
  match: Match & {
    Team1: Team;
    Team2: Team;
  };
  session: Session;
}> = ({ match }) => {
  const [addScoreEnabled, setAddScoreEnabled] = useState<boolean>(false);
  const [undoLastEventEnabled, setUndoLastEventEnabled] =
    useState<boolean>(false);
  const [scoreData, setScoreData] = useState<matchScore | undefined>();
  const [actionData, setActionData] = useState<{
    team: number;
    amount: number;
  }>({ team: 1, amount: 0 });

  const scoreRequest = api.scoring.fetch.useQuery(
    { id: match.id },
    {
      onSuccess(data: fetchMatchScoreResponse) {
        if (data.data.status != "ok") throw new Error();
        setScoreData(data.data.score);
      },
      refetchInterval: 1000,
    }
  );

  api.scoring.addAddEvent.useQuery(
    { id: match.id, team: actionData.team, score: actionData.amount },
    {
      enabled: addScoreEnabled,
      async onSuccess() {
        setAddScoreEnabled(false);
        await scoreRequest.refetch();
      },
    }
  );

  api.scoring.undoLastEvent.useQuery(
    { id: match.id },
    {
      enabled: undoLastEventEnabled,
      async onSuccess() {
        setUndoLastEventEnabled(false);
        await scoreRequest.refetch();
      },
    }
  );

  return (
    <>
      <Head>
        <title>Score Match</title>
      </Head>
      <div className="h-screen dark:bg-[#282a36] dark:text-[#f8f8f2]">
        <Header />
        <main className="flex flex-col justify-center">
          <div className="m-4 grid grid-cols-2 gap-2">
            <div className="flex h-fit flex-col items-center justify-center border border-slate-700">
              <div className="text-center text-2xl">{match.Team1.name}</div>
              <div className="h-full">
                <MinimalScoreBox data={scoreData ?? { events: [] }} team={1} />
              </div>
              <MatchScoreButtons
                team={1}
                actionDataState={setActionData}
                requestEnableState={setAddScoreEnabled}
              />
            </div>
            <div className="flex h-fit flex-col items-center justify-center border border-slate-700">
              <div className="text-center text-2xl">{match.Team2.name}</div>
              <div className="h-fit">
                <MinimalScoreBox data={scoreData ?? { events: [] }} team={2} />
              </div>
              <MatchScoreButtons
                team={2}
                actionDataState={setActionData}
                requestEnableState={setAddScoreEnabled}
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-2">
            <button
              onClick={() => {
                setUndoLastEventEnabled(true);
              }}
              type="button"
              className="inline-block rounded border-2 border-yellow-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-gray-800 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 dark:border-[#f1fa8c] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
            >
              ↺
            </button>
            <Link href={`/match/${match.id}/score/raw`} className="p-1">
              <button
                type="button"
                className="inline-block rounded border-2 border-gray-800 px-6 py-2 text-xs font-medium uppercase leading-tight text-gray-800 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 dark:border-[#44475a] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
              >
                edit raw data
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
};

export default ScoreMatch;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getSession(context);
  const { id } = context.params!;
  if (!id || Array.isArray(id)) throw new Error("bad id");

  if (!session)
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };

  const caller = appRouter.createCaller({
    session: session,
    prisma: prisma,
  });

  const match = await caller.match.fetch({ id });
  if (match.data.status == "not-found")
    return {
      notFound: true,
    };
  if (match.data.status != "ok") throw new Error();
  if (!match.data.match.Team1 || !match.data.match.Team2)
    return {
      redirect: {
        destination: "/match/" + match.data.match.id,
        permanent: false,
      },
    };
  return {
    props: {
      session,
      match: match.data.match,
    },
  };
};
