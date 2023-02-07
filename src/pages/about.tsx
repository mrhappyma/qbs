import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/header";

const about: NextPage = () => {
  return (
    <>
      <Head>
        <title>About qbs</title>
      </Head>
      <main className="mx-auto h-screen w-screen p-2 dark:bg-[#282a36] dark:text-[#f8f8f2] md:pb-24">
        <Header />
        <h1 className="text-2xl font-semibold">About</h1>
        <div className="p-3">
          Quizbowl Score (qbs), © {new Date().getFullYear()}{" "}
          <a
            href="https://userexe.me"
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            Dominic Ruggiero
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/mrhappyma/qbs/graphs/contributors?type=a"
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            additional contributors
          </a>
          .
        </div>
        <div className="p-3">
          This program is free software: you can redistribute it and/or modify
          it under the terms of the{" "}
          <a
            href="https://www.gnu.org/licenses/agpl-3.0.txt"
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            GNU Affero General Public License
          </a>{" "}
          as published by the Free Software Foundation, either version 3 of the
          License, or (at your option) any later version.
        </div>
        <div className="p-3">
          You can access the source code, submit bugs, and contribute to this
          project{" "}
          <a
            href="https://github.com/mrhappyma/qbs"
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            on GitHub
          </a>
          .
        </div>
        <div className="p-3">
          Questions? Email me:{" "}
          <a
            href="mailto:dominic@userexe.me"
            className="text-blue-600 transition-colors dark:text-[#6272a4] dark:hover:text-[#44475a]"
          >
            dominic@userexe.me
          </a>
        </div>
      </main>
    </>
  );
};

export default about;
