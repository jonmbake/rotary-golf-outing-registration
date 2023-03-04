import Hero from "@/components/Hero";
import Head from 'next/head'
import { useEffect } from "react";

export default function Success() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const s = window.sessionStorage.removeItem('selections');
    }
  }, []);
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
          <h2>Thank you!</h2>
          </Hero>
          <p>We look forward to seeing you at the 2023 Madison West Middleton Rotary Golf Outing!</p>
        </main>
      </div>
    </>
  );
}
