import { Match, Team } from "@prisma/client";
import { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { ParsedUrl } from "next/dist/shared/lib/router/utils/parse-url";
import Head from "next/head";
import { ParsedUrlQuery } from "node:querystring";
import { useState } from "react";
import MatchScoreBox from "../../../../components/matchScoreBox";
import { appRouter } from "../../../../server/api/root";
import { api } from "../../../../utils/api";

const presentScores: NextPage<{
  match: Match & {
    Team1: Team;
    Team2: Team;
  };
  session: Session | null;
}> = ({ match, session }) => {
  const [scoreData, setScoreData] = useState<matchScore>({ events: [] });
  const scores = api.scoring.fetch.useQuery(
    { id: match.id },
    {
      onSuccess(data) {
        if (data.data.status != "ok") throw new Error();
        setScoreData(data.data.score);
      },
      refetchInterval: 300,
    }
  );

  return (
    <>
      <Head>
        <title>Present Scores</title>
      </Head>
      <main className="flex h-screen max-h-screen w-screen flex-col justify-center">
        <div className="grid grid-cols-2">
          <div
            className={`flex h-screen  flex-col items-center justify-center border border-slate-700 bg-gradient-to-b from-${match.Team1.color1} to-[${match.Team1.color2}]`}
            style={{
              background: `linear-gradient(to top, ${match.Team1.color1} 0%, ${match.Team1.color2} 100%)`,
            }}
          >
            <div className="text-center text-2xl">{match.Team1.name}</div>
            <MatchScoreBox data={scoreData} team={1} />
          </div>
          <div
            className={`flex h-screen  flex-col items-center justify-center border border-slate-700 bg-gradient-to-b from-${match.Team2.color1} to-[${match.Team2.color2}`}
            style={{
              background: `linear-gradient(to top, ${match.Team2.color1} 0%, ${match.Team2.color2} 100%)`,
            }}
          >
            <div className="text-center text-2xl">{match.Team2.name}</div>
            <MatchScoreBox data={scoreData} team={2} />
          </div>
        </div>
      </main>
    </>
  );
};

export default presentScores;

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const session = await getSession(context);
  const { id } = context.params!;
  if (!id || Array.isArray(id)) throw new Error("bad id");

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
