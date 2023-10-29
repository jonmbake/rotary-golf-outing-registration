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
          <Hero subtitle="Thank you!"/>
          <p>We look forward to seeing you at the {process.env.NEXT_PUBLIC_GOLF_OUTING_YEAR} Madison West Middleton Rotary Golf Outing!</p>
        </main>
      </div>
    </>
  );
}
