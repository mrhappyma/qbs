import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Header from "../../components/header";
import { appRouter } from "../../server/api/root";
import type { ParsedUrlQuery } from "node:querystring";
import type { Team } from "@prisma/client";
import { api } from "../../utils/api";
import type { Session } from "next-auth";
import { useState } from "react";
import { prisma } from "../../server/db";

const TeamPage: NextPage<{ team: Team; session: Session }> = ({ team }) => {
  const [form, setForm] = useState<{
    name?: string | undefined;
    logoUrl?: string | undefined;
    color1?: string | undefined;
    color2?: string | undefined;
    id: string;
  }>({ id: team.id });
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);

  api.team.update.useQuery(form, {
    enabled: submitEnabled,
  });

  return (
    <>
      <Head>
        <title>{team.name}</title>
      </Head>
      <div className="h-screen w-screen dark:bg-[#282a36] dark:text-[#f8f8f2]">
        <Header />
        <main className="m-4">
          <form
            onSubmit={(event: React.SyntheticEvent) => {
              event.preventDefault();
              const target = event.target as typeof event.target & {
                name: { value: string };
                logo: { value: string };
                color1: { value: string };
                color2: { value: string };
              };
              setForm({
                id: team.id,
                name: target.name.value,
                logoUrl: target.logo.value,
                color1: target.color1.value,
                color2: target.color2.value,
              });
              setSubmitEnabled(true);
            }}
          >
            <input
              className="mb-4 rounded-sm border text-3xl hover:border-blue-400 dark:bg-[#282a36] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
              type="text"
              name="name"
              defaultValue={team.name}
              minLength={3}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
            />
            <br />
            <label className="text-xs">
              LOGO URL
              <br />
              <input
                type="text"
                name="logo"
                id="logo"
                className="border border-gray-500 text-base hover:border-blue-400 dark:bg-[#282a36] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
              />
            </label>
            <h3 className="pt-4 text-xl">Colors</h3>
            <div className="flex-row justify-start">
              <input
                type="color"
                name="color1"
                defaultValue={team.color1 ?? undefined}
                className="m-3 dark:bg-[#282a36] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
              />
              <input
                type="color"
                name="color2"
                defaultValue={team.color2 ?? undefined}
                className="m-3 dark:bg-[#282a36] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
              />
            </div>
            <button
              type="submit"
              className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 dark:bg-[#282a36] dark:text-[#f8f8f2] dark:hover:bg-[#44475a]"
            >
              Save
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default TeamPage;

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

  const team = await caller.team.fetch({ id });

  if (team.data.status == "error") throw new Error();
  if (team.data.status == "not-found")
    return {
      notFound: true,
    };
  if (team.data.status == "unauthorized")
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  if (team.data.status == "forbidden") throw new Error("forbidden"); // should be error 403 but idk how to do that lol

  if (team.data.status != "ok") throw new Error();

  return {
    props: { session, team: team.data.team },
  };
};
