import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Header from "../../../components/header";
import { appRouter } from "../../../server/api/root";
import type { ParsedUrlQuery } from "node:querystring";
import type { Match, Team } from "@prisma/client";
import { api } from "../../../utils/api";
import type { Session } from "next-auth";
import { useState } from "react";
import Link from "next/link";

const MatchPage: NextPage<{
  teams: Team[];
  match: Match;
  session: Session;
}> = ({ teams, match }) => {
  const [form, setForm] = useState<{
    id: string;
    name?: string;
    team1?: string;
    team2?: string;
  }>({ id: match.id });
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);

  api.match.updateDetails.useQuery(form, {
    enabled: submitEnabled,
    onSuccess() {
      setSubmitEnabled(false);
    },
  });

  const teamOptions: JSX.Element[] = [];
  for (const team of teams)
    teamOptions.push(
      <option value={team.id} key={team.id}>
        {team.name}
      </option>
    );

  return (
    <>
      <Head>
        <title>{match.name}</title>
      </Head>
      <Header />
      <main className="m-4">
        <form
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            const target = event.target as typeof event.target & {
              name: { value: string };
              team1: { value: string };
              team2: { value: string };
            };
            setForm({
              id: match.id,
              name: target.name.value,
              team1: target.team1.value,
              team2: target.team2.value,
            });
            setSubmitEnabled(true);
          }}
          className="mb-3"
        >
          <input
            className="mb-4 rounded-sm border text-3xl hover:border-blue-400"
            type="text"
            name="name"
            defaultValue={match.name}
            minLength={3}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
          />
          <br />
          <h3 className="pt-4 text-xl">Teams</h3>
          <div className="flex flex-row justify-start">
            <select
              name="team1"
              className="m-3"
              defaultValue={match.team1Id ?? undefined}
            >
              {teamOptions}
            </select>
            <div className="text-center text-sm">vs</div>
            <select
              name="team2"
              className="m-3"
              defaultValue={match.team2Id ?? undefined}
            >
              {teamOptions}
            </select>
          </div>
          <button
            type="submit"
            className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0"
          >
            Save
          </button>
        </form>
        <div className="flex flex-row justify-start">
          <Link href={`/match/${match.id}/score`} className="pl-2">
            <button className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0">
              Score
            </button>
          </Link>
          <a
            href={`/match/${match.id}/present`}
            className="pl-2"
            target="_blank"
          >
            <button className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0">
              Present
            </button>
          </a>
        </div>
      </main>
    </>
  );
};

export default MatchPage;

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
  const teams = await caller.team.list();

  if (match.data.status == "not-found")
    return {
      notFound: true,
    };

  if (match.data.status != "ok") throw new Error();
  if (teams.data.status != "ok") throw new Error();

  return {
    props: { session, match: match.data.match, teams: teams.data.teams },
  };
};
