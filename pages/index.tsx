import Head from "next/head";
import { Inter } from "@next/font/google";
import Hero from "@/components/Hero";
import Selections from "@/components/ProductsSelections";
import ContactInfo from "@/components/ContactInfo";

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
          <Hero subtitle="Golf and Sponsorship Registration">
          <p className="lead">
            Come join us for some golfing fun on Monday, June 19, 2023, at Pleasant View Golf Course.
          </p>
          </Hero>
          <Selections />
          <ContactInfo />
        </main>
      </div>
    </>
  );
}
