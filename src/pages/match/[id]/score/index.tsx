import { Match, Team } from "@prisma/client";
import { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { appRouter } from "../../../../server/api/root";
import { api } from "../../../../utils/api";
import MatchScoreBox from "../../../../components/matchScoreBox";
import MatchScoreButtons from "../../../../components/matchScoreButtons";
import { useState } from "react";
import Link from "next/link";
import Header from "../../../../components/header";

const scoreMatch: NextPage<{
  match: Match & {
    Team1: Team;
    Team2: Team;
  };
  session: Session;
}> = ({ match, session }) => {
  const [addScoreEnabled, setAddScoreEnabled] = useState<boolean>(false);
  const [undoLastEventEnabled, setUndoLastEventEnabled] =
    useState<boolean>(false);
  const [scoreData, setScoreData] = useState<matchScore | undefined>();
  const [actionData, setActionData] = useState<{
    team: number;
    amount: number;
  }>({ team: 1, amount: 0 });
  const [undoData, setUndoData] = useState<{
    team: number;
  }>({ team: 1 });

  const scoreRequest = api.scoring.fetch.useQuery(
    { id: match.id },
    {
      onSuccess(data) {
        if (data.data.status != "ok") throw new Error();
        setScoreData(data.data.score);
      },
    }
  );

  api.scoring.addAddEvent.useQuery(
    { id: match.id, team: actionData.team, score: actionData.amount },
    {
      enabled: addScoreEnabled,
      onSuccess() {
        setAddScoreEnabled(false);
        scoreRequest.refetch();
      },
    }
  );

  api.scoring.undoLastEvent.useQuery(
    { id: match.id, team: undoData.team },
    {
      enabled: undoLastEventEnabled,
      onSuccess() {
        setUndoLastEventEnabled(false);
        scoreRequest.refetch();
      },
    }
  );

  return (
    <>
      <Head>
        <title>Score Match</title>
      </Head>
      <Header />
      <main className="flex flex-col justify-center">
        <div className="m-4 grid grid-cols-2 gap-2">
          <div className="flex h-screen  flex-col items-center justify-center border border-slate-700">
            <div className="text-center text-2xl">{match.Team1.name}</div>
            <MatchScoreBox data={scoreData ?? { events: [] }} team={1} />
            <MatchScoreButtons
              team={1}
              actionDataState={setActionData}
              requestEnableState={setAddScoreEnabled}
              undoDataState={setUndoData}
              undoEnableState={setUndoLastEventEnabled}
            />
          </div>
          <div className="flex h-screen  flex-col items-center justify-center border border-slate-700">
            <div className="text-center text-2xl">{match.Team2.name}</div>
            <MatchScoreBox data={scoreData ?? { events: [] }} team={2} />
            <MatchScoreButtons
              team={2}
              actionDataState={setActionData}
              requestEnableState={setAddScoreEnabled}
              undoDataState={setUndoData}
              undoEnableState={setUndoLastEventEnabled}
            />
          </div>
        </div>
        <Link
          href={`/match/${match.id}/score/raw`}
          className="flex justify-center p-1"
        >
          <button
            type="button"
            className="inline-block rounded border-2 border-gray-800 px-6 py-2 text-xs font-medium uppercase leading-tight text-gray-800 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
          >
            edit raw data
          </button>
        </Link>
      </main>
    </>
  );
};

export default scoreMatch;

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
    prisma: global.prisma!,
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
