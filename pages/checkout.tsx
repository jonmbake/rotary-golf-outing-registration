import ContactInfo from '@/components/ContactInfo';
import GolferInfo from '@/components/GolferInfo';
import Hero from '@/components/Hero';
import { normalizeForCheckout } from '@/data/products';
import Product from '@/types/Products';
import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Checkout() {
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const s = window.sessionStorage.getItem('selections');
      if (s) {
        setSelectedProducts(JSON.parse(s));
      }
    }
  }, []);

  const checkoutProducts = normalizeForCheckout(selectedProducts);

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
        <Hero subtitle='Golf Registration - Golfer Information'/>
        <Link href={ process.env.NEXT_PUBLIC_DOMAIN_NAME || '/' } className='mb-3'>&lt;- Back</Link>
        <form action={ process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/checkout' } method="post">
          <input type="hidden" name="products" value={JSON.stringify(checkoutProducts)} />
          <GolferInfo numberOfGolfers={ checkoutProducts['golf_individual'] }/>
          <button type="submit" className="w-100 btn btn-primary btn-lg">Submit</button>
          <div className="form-text mb-5 text-start mb-5">Next step: Review and Pay</div>
        </form>
        <ContactInfo />
      </main>
    </div>
  </>
  )
}