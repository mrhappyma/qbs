import type { Match, Team } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import Header from "../../../../components/header";
import { appRouter } from "../../../../server/api/root";
import { api } from "../../../../utils/api";
import { prisma } from "../../../../server/db";

const EditRawData: NextPage<{
  match: Match & {
    Team1: Team;
    Team2: Team;
  };
  session: Session;
}> = ({ match }) => {
  const router = useRouter();

  const [form, setForm] = useState<{ value: string }>({ value: match.scores });
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false);
  api.scoring.override.useQuery(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { id: match.id, value: JSON.parse(form.value) },
    {
      enabled: submitEnabled,
      async onSuccess() {
        await router.push(`/match/${match.id}/score`);
      },
    }
  );

  return (
    <>
      <Head>
        <title>Edit raw match data</title>
      </Head>
      <div className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
        <Header />
        <main className="m-1 flex h-screen w-screen justify-center">
          <form
            onSubmit={(event: React.SyntheticEvent) => {
              event.preventDefault();
              const target = event.target as typeof event.target & {
                value: { value: string };
              };
              setForm({
                value: target.value.value,
              });
              setSubmitEnabled(true);
            }}
          >
            <textarea
              name="value"
              defaultValue={match.scores}
              className="m-2 h-3/5 w-[90vh] border border-blue-400 dark:border-[#44475a] dark:bg-[#282a36] dark:hover:bg-[#44475a]"
              cols={21}
            />
            <br />
            <button
              type="submit"
              className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 dark:border-[#44475a] dark:hover:bg-[#44475a]"
            >
              Save
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default EditRawData;

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

  return {
    props: {
      session,
      match: match.data.match,
    },
  };
};
