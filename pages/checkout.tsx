import GolferInfo from '@/components/GolferInfo';
import Hero from '@/components/Hero';
import { normalizeForCheckout } from '@/data/products';
import Product from '@/types/Products';
import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Checkout() {
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);

  function getGolferCount () : number {
    if (selectedProducts.find((product: Product) => product.id === 'golf_team') != null) {
      return 4;
    }
    return selectedProducts.filter((product: Product) => product.id === 'golf_individual').length;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const s = window.sessionStorage.getItem('selections');
      if (s) {
        setSelectedProducts(JSON.parse(s));
      }
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
          <h2>Golfer Information</h2>
        </Hero>
        <Link href={ process.env.NEXT_PUBLIC_DOMAIN_NAME || '/' } className='mb-3'>&lt;- Back</Link>
        <form action={ process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/checkout' } method="post">
          <input type="hidden" name="products" value={JSON.stringify(normalizeForCheckout(selectedProducts))} />
          <GolferInfo numberOfGolfers={ getGolferCount() }/>
          <button type="submit" className="w-100 btn btn-primary btn-lg">Submit</button>
          <div className="form-text mb-5 text-start mb-5">Next step: Review and Pay</div>
        </form>
      </main>
    </div>
  </>
  )
}