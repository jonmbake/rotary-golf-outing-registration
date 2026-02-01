import ContactInfo from '@/components/ContactInfo';
import GolferInfo from '@/components/GolferInfo';
import Hero from '@/components/Hero';
import { normalizeForCheckout } from '@/data/products';
import Product from '@/types/Products';
import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Checkout() {
  const router = useRouter();
  const { query } = router;
  const [selectedProducts, setSelectedProducts] = useState<Array<Product>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <title>Annual Madison West Middleton Rotary Golf Outing Registration - Checkout</title>
      <meta
        name="description"
        content="Annual Madison West Middleton Rotary Golf Outing registration checkout."
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className="container">
      <main>
        <Hero subtitle='Golf Registration - Golfer Information'/>
        <Link href={ process.env.NEXT_PUBLIC_DOMAIN_NAME || '/' } className='mb-3'>&lt;- Back</Link>
        <form action={ process.env.NEXT_PUBLIC_DOMAIN_NAME + '/api/checkout' } method="post" onSubmit={() => setIsSubmitting(true)}>
          <input type="hidden" name="products" value={JSON.stringify(checkoutProducts)} />
          <input type="hidden" name="cover_cc_fees" value={query.cover_cc_fees} />
          <GolferInfo numberOfGolfers={ checkoutProducts['golf_individual'] }/>
          <button type="submit" disabled={isSubmitting} className="w-100 btn btn-primary btn-lg">
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <div className="form-text mb-5 text-start mb-5">Next step: Review and Pay</div>
        </form>
        <ContactInfo />
      </main>
    </div>
  </>
  )
}