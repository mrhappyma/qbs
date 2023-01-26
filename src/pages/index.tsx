import type { GetServerSidePropsContext, PreviewData, NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import Header from "../components/header";
import type { ParsedUrlQuery } from "node:querystring";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>QuizBowl Score</title>
      </Head>
      <Header />
    </>
  );
};

export default Home;

export async function getServerSideProps(
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  // this type is not proper but works?
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
