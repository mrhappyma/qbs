import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import type { ParsedUrlQuery } from "node:querystring";
import CreateMatchButton from "../components/createMatchButton";
import Header from "../components/header";
import { appRouter } from "../server/api/root";
import type { minimalMatchData } from "../types/matchApiResponses";
import { prisma } from "../server/db";

const Matches: NextPage<{ matches: minimalMatchData[]; session: Session }> = ({
  matches,
}) => {
  const tableItems: JSX.Element[] = [];
  for (const match of matches) {
    tableItems.push(
      <tr>
        <td>
          <Link
            className="text-blue-400 hover:text-blue-700 dark:text-[#f8f8f2] dark:hover:text-[#44475a]"
            href={`/match/${match.id}`}
          >
            {match.name}
          </Link>
        </td>
        <td>{match.team1Name}</td>
        <td>{match.team2Name}</td>
        <td>{new Date(match.updatedAt).toLocaleDateString()}</td>
      </tr>
    );
  }

  return (
    <>
      <Head>
        <title>Matches</title>
      </Head>
      <div className="h-screen w-screen dark:bg-[#282a36] dark:text-[#f8f8f2]">
        <Header />
        <main className="container mx-auto pb-20 md:pb-24">
          <section className="mb-24">
            <header className="mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="m-3 mb-2 text-3xl font-semibold leading-tight tracking-tight">
                    Matches
                  </h1>
                </div>
              </div>
            </header>
            <CreateMatchButton />
            <div className="m-3 flex justify-start">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Team 1</th>
                    <th>Team 2</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>{tableItems}</tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Matches;

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
  const matches = await caller.match.list();

  if (matches.data.status != "ok") throw new Error();

  return {
    props: { session, matches: matches.data.matches },
  };
}
