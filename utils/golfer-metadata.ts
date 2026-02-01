import Stripe from 'stripe';

export interface GolferMetadata {
  name?: string;
  email?: string;
}

export function extractGolferMetadata(metadata: Stripe.Metadata): GolferMetadata[] {
  const golferMetadata: GolferMetadata[] = [];
  Object.keys(metadata).forEach(key => {
      if (key.startsWith('golfer')) {
          const match = /golfer(\d+)_(name|email)/.exec(key);
          if (match) {
              const index = parseInt(match[1], 10) - 1;
              golferMetadata[index] = golferMetadata[index] || {};
              (golferMetadata[index] as Record<string, string>)[match[2]] = metadata[key];
          }
      }
  });
  return golferMetadata;
}
