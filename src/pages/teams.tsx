import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import type { ParsedUrlQuery } from "node:querystring";
import CreateTeamButton from "../components/createTeamButton";
import Header from "../components/header";
import { appRouter } from "../server/api/root";
import type { minimalTeamData } from "../types/teamApiResponses";
import { prisma } from "../server/db";

const Teams: NextPage<{ teams: minimalTeamData[]; session: Session }> = ({
  teams,
}) => {
  const tableItems: JSX.Element[] = [];
  for (const team of teams) {
    tableItems.push(
      <tr>
        <td>
          <Link
            className="text-blue-400 hover:text-blue-700"
            href={`/team/${team.id}`}
          >
            {team.name}
          </Link>
        </td>
        <td>{team.numberOfMatches}</td>
        <td>{new Date(team.lastUpdated).toLocaleDateString()}</td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>Teams</title>
      </Head>
      <Header />
      <main className="container mx-auto pb-20 md:pb-24 ">
        <section className="mb-24">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="m-3 mb-2 text-3xl font-semibold leading-tight tracking-tight">
                  Teams
                </h1>
              </div>
            </div>
          </header>
          <CreateTeamButton />
          <div className="m-3 flex justify-start">
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Number of matches</th>
                  <th>Last updated</th>
                </tr>
              </thead>
              <tbody>{tableItems}</tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
};

export default Teams;

export async function getServerSideProps(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  const caller = appRouter.createCaller({
    session: session,
    prisma: prisma,
  });
  const teams = await caller.team.list();

  if (teams.data.status != "ok") throw new Error();

  return {
    props: { session, teams: teams.data.teams },
  };
}
