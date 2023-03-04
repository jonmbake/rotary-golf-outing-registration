import Head from "next/head";
import { Inter } from "@next/font/google";
import Hero from "@/components/Hero";
import Selections from "@/components/ProductsSelections";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>MWM Rotary 2023 Golf Registration</title>
        <meta
          name="description"
          content="Madison West Middleton Rotary 2023 Golf Registration"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="container">
        <main>
          <Hero>
            <p className="lead">
              <b>
                Monday, June 19, 2023; Pleasant View Golf Course, Middleton,
                Wisconsin; 9:00 am shotgun start.
              </b>{" "}
              Have some fun and at the same time support the Madison West
              Middleton Rotary Foundation, Inc. (a 501 c 3 Charitable
              Organization). All proceeds from the Annual Golf Outing fund our
              local and international projects and programs.
            </p>
          </Hero>
          <Selections />
        </main>
      </div>
    </>
  );
}
