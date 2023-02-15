import type { GetServerSidePropsContext, NextPage, PreviewData } from "next";
import type { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Head from "next/head";
import type { ParsedUrlQuery } from "node:querystring";
import Header from "../../../../components/header";
import presentScreens from "../../../../utils/present-list";
import Image from "next/image";
import Link from "next/link";

const PresentScores: NextPage<{
  id: string;
  session: Session | null;
}> = ({ id }) => {
  const items: JSX.Element[] = [];
  for (const item of presentScreens) {
    items.push(
      <div
        className="m-2 flex flex-col items-center justify-center bg-yellow-400 p-1 dark:bg-[#f1fa8c]"
        key={item.slug}
      >
        <Image
          src={`/present-screenshots/${item.slug}.png`}
          alt={`Screenshot of ${item.name}`}
          title={item.description}
          height={500}
          width={500}
        />
        <div className="text-sm">
          by{" "}
          <a
            href={item.authorLink}
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            {item.author}
          </a>
        </div>
        <Link href={`/match/${id}/present/${item.slug}`}>
          <button className="inline-block rounded border-2 border-blue-600 px-6 py-2 text-xs font-medium uppercase leading-tight text-blue-600 transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0">
            {item.name}
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Present Scores</title>
      </Head>
      <div className="h-screen w-screen dark:bg-[#282a36]">
        <Header />
        <div className="flex flex-wrap justify-around dark:bg-[#282a36]">
          {items}
        </div>
      </div>
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

  return {
    props: {
      session,
      id,
    },
  };
};
