export default function Contact() {
  return (
    <p>
    For golf outing information, see the <a target="_blank" rel="noreferrer" href="https://madisonwestmidrotary.org/SitePage/annual-golf-outing/annual-golf-outing-home-page">Annual Golf Outing Home Page</a>.  For questions, please contact{' '}
      <a
        href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        { process.env.NEXT_PUBLIC_CONTACT_NAME }
      </a>{' '}
      at { process.env.NEXT_PUBLIC_CONTACT_EMAIL }.
    </p>
  );
}