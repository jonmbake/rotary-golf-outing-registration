import Airtable, { FieldSet, Records } from 'airtable';

let _base: ReturnType<Airtable['base']> | null = null;

function getBase() {
  if (!_base) {
    if (!process.env.AIRTABLE_API_KEY) {
      throw new Error('AIRTABLE_API_KEY environment variable is required');
    }
    if (!process.env.AIRTABLE_BASE_ID) {
      throw new Error('AIRTABLE_BASE_ID environment variable is required');
    }
    _base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
  }
  return _base;
}

export interface GolferInput {
  name: string;
  email?: string;
  teamNumber?: number;
  paid?: 'Yes' | 'No';
}

export interface ReceiptInput {
  payer: string;
  payerEmail?: string;
  payerPhone?: string;
  invoicedAmount: number;
  itemsPurchased: string[];
  donationAmount?: number;
  sponsorIncome?: number;
  paymentDate: string;
  receiptType: string;
  golferIds?: string[];
  stripePaymentAmount?: number;
}

export interface DepositInput {
  depositNumber: number;
  depositSource: string;
  depositDate: string;
  depositAmount: number;
  audited?: boolean;
  receiptIds?: string[];
  note?: string;
}

export async function getMaxTeamNumber(): Promise<number> {
  let maxTeamNumber = 0;

  await getBase()('Golfers').select({
    fields: ['Team #']
  }).eachPage((records: Records<FieldSet>, fetchNextPage: () => void) => {
    records.forEach(record => {
      const teamNumber = parseInt(record.get('Team #') as string, 10);
      if (teamNumber > maxTeamNumber) {
        maxTeamNumber = teamNumber;
      }
    });
    fetchNextPage();
  });

  return maxTeamNumber;
}

export async function addGolfer(input: GolferInput): Promise<string> {
  const teamNumber = input.teamNumber ?? (await getMaxTeamNumber()) + 1;

  const record = await getBase()('Golfers').create({
    'Golfer Name': input.name,
    'Team #': teamNumber,
    'Golfer Email': input.email,
    'Paid': input.paid ?? 'Yes'
  });

  return record.id;
}

export async function addReceipt(input: ReceiptInput): Promise<string> {
  const record = await getBase()('Receipts').create({
    'Payer': input.payer,
    'Payer Email': input.payerEmail || '',
    'Payer Phone': input.payerPhone || '',
    'Invoiced Amount': input.invoicedAmount,
    'Items Purchased': input.itemsPurchased,
    'Donation Amount': input.donationAmount,
    'Sponsor Income': input.sponsorIncome,
    'Golfers': input.golferIds || [],
    'Payment Date': input.paymentDate,
    'Receipt Type': input.receiptType,
    'Stripe Payment Amount': input.stripePaymentAmount
  });

  return record.id;
}

export async function addDeposit(input: DepositInput): Promise<string> {
  const record = await getBase()('Deposits').create({
    'Deposit Number': input.depositNumber,
    'Deposit Source': input.depositSource,
    'Deposit Date': input.depositDate,
    'Deposit Amount': input.depositAmount,
    'Audited': input.audited ?? false,
    'Receipts': input.receiptIds || [],
    'Note': input.note || ''
  });

  return record.id;
}

export { getBase };
