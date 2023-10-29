import Head from "next/head";
import { Inter } from "@next/font/google";
import Hero from "@/components/Hero";
import Selections from "@/components/ProductsSelections";
import ContactInfo from "@/components/ContactInfo";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  let leadMessage = 'Registration is closed. See you all next year!';
  if (process.env.NEXT_PUBLIC_REGISTRATION_OPEN === 'true') {
    leadMessage = `Come join us for some golfing fun on ${process.env.NEXT_PUBLIC_GOLF_OUTING_DATE}, ${process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR}, at ${process.env.NEXT_PUBLIC_GOLF_OUTING_LOCATION}.`
  }
  return (
    <>
      <Head>
        <title>MWM Rotary {process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Registration</title>
        <meta
          name="description"
          content="Madison West Middleton Rotary {process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Golf Registration"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="container">
        <main>
          <Hero subtitle="Golf and Sponsorship Registration">
          <p className="lead">{leadMessage}</p>
          </Hero>
          { process.env.NEXT_PUBLIC_REGISTRATION_OPEN === 'true' && (
            <>
              <Selections />
              <ContactInfo />
            </>
          )}
        </main>
      </div>
    </>
  );
}
