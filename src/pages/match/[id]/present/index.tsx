import type { Match, Team } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import type { ParsedUrlQuery } from "node:querystring";
import { useState } from "react";
import MatchScoreBox from "../../../../components/matchScoreBox";
import { appRouter } from "../../../../server/api/root";
import { api } from "../../../../utils/api";
import { prisma } from "../../../../server/db";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const PresentScores: NextPage<{
  match: Match & {
    Team1: Team;
    Team2: Team;
  };
  session: Session | null;
}> = ({ match }) => {
  const [scoreData, setScoreData] = useState<matchScore>({ events: [] });
  api.scoring.fetch.useQuery(
    { id: match.id },
    {
      onSuccess(data) {
        if (data.data.status != "ok") throw new Error();
        setScoreData(data.data.score);
      },
      refetchInterval: 300,
    }
  );

  const handleFullScreen = useFullScreenHandle();
  const [hideFullScreenBar, setHideFullScreenBar] = useState(false);
  const handleHideFullScreenBar = () => {
    setHideFullScreenBar(true);
  };

  return (
    <>
      <Head>
        <title>Present Scores</title>
      </Head>
      <FullScreen handle={handleFullScreen}>
        <main className="flex h-screen max-h-screen w-screen flex-col justify-center">
          <div className="grid grid-cols-2">
            <div
              className={`flex h-screen  flex-col items-center justify-center border border-slate-700`}
              style={{
                background: `linear-gradient(to top, ${
                  match.Team1.color1 ?? "#FFFFFF"
                } 0%, ${match.Team1.color2 ?? "#FFFFFF"} 100%)`,
              }}
            >
              <div className="text-center text-2xl">{match.Team1.name}</div>
              <MatchScoreBox data={scoreData} team={1} />
            </div>
            <div
              className={`flex h-screen  flex-col items-center justify-center border border-slate-700`}
              style={{
                background: `linear-gradient(to top, ${
                  match.Team2.color1 ?? "#FFFFFF"
                } 0%, ${match.Team2.color2 ?? "#FFFFFF"} 100%)`,
              }}
            >
              <div className="text-center text-2xl">{match.Team2.name}</div>
              <MatchScoreBox data={scoreData} team={2} />
            </div>
          </div>
        </main>
        {!handleFullScreen.active && !hideFullScreenBar && (
          <div className="flex flex-row justify-around">
            <button
              className="border border-blue-500 text-2xl"
              onClick={() => {
                void handleFullScreen.enter();
              }}
            >
              enter fullscreen
            </button>
            <button
              className="border border-blue-500 text-2xl"
              onClick={() => {
                handleHideFullScreenBar();
              }}
            >
              hide this
            </button>
          </div>
        )}
      </FullScreen>
    </>
  );
};

export default PresentScores;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getSession(context);
  const { id } = context.params!;
  if (!id || Array.isArray(id)) throw new Error("bad id");

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
