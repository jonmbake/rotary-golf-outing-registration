#!/usr/bin/env npx ts-node

import * as readline from 'readline';
import { addGolfer, addReceipt, addDeposit, getMaxTeamNumber } from '../utils/airtable';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function promptNumber(question: string, defaultValue?: number): Promise<number | undefined> {
  const answer = await prompt(question);
  if (!answer && defaultValue !== undefined) return defaultValue;
  if (!answer) return undefined;
  return parseFloat(answer);
}

async function promptDate(question: string): Promise<string> {
  const answer = await prompt(question);
  if (!answer) return new Date().toISOString().substring(0, 10);
  return answer;
}

async function addGolferFlow() {
  console.log('\n--- Add Golfer ---\n');

  const name = await prompt('Golfer Name: ');
  if (!name) {
    console.log('Name is required.');
    return;
  }

  const email = await prompt('Email (optional): ');
  const maxTeam = await getMaxTeamNumber();
  const teamNumber = await promptNumber(`Team # (current max: ${maxTeam}, press Enter for ${maxTeam + 1}): `, maxTeam + 1);
  const paidAnswer = await prompt('Paid? (Y/n): ');
  const paid = paidAnswer.toLowerCase() === 'n' ? 'No' : 'Yes';

  console.log('\nCreating golfer...');
  const id = await addGolfer({
    name,
    email: email || undefined,
    teamNumber,
    paid: paid as 'Yes' | 'No'
  });

  console.log(`Golfer created with ID: ${id}\n`);
}

async function addReceiptFlow() {
  console.log('\n--- Add Receipt ---\n');

  const payer = await prompt('Payer Name: ');
  if (!payer) {
    console.log('Payer name is required.');
    return;
  }

  const payerEmail = await prompt('Payer Email (optional): ');
  const payerPhone = await prompt('Payer Phone (optional): ');
  const invoicedAmount = await promptNumber('Invoiced Amount: ');
  if (!invoicedAmount) {
    console.log('Invoiced amount is required.');
    return;
  }

  console.log('Items Purchased (comma-separated, e.g., "2 Golfers, Donation"):');
  const itemsStr = await prompt('Items: ');
  const itemsPurchased = itemsStr.split(',').map(s => s.trim()).filter(Boolean);

  const donationAmount = await promptNumber('Donation Amount (optional): ');
  const sponsorIncome = await promptNumber('Sponsor Income (optional): ');
  const paymentDate = await promptDate('Payment Date (YYYY-MM-DD, Enter for today): ');

  console.log('Receipt Types: Check, Cash, Online - Credit Card, Other');
  const receiptType = await prompt('Receipt Type: ') || 'Check';

  // Auto-create TBD golfers if items include golfers (e.g., "2 Golfers")
  let golferIds: string[] | undefined;
  const golferItem = itemsPurchased.find(item => /\d+\s*golfer/i.test(item));
  if (golferItem) {
    const match = golferItem.match(/(\d+)/);
    const golferCount = match ? parseInt(match[1], 10) : 0;
    if (golferCount > 0) {
      console.log(`\nAuto-creating ${golferCount} golfer(s) with name "TBD"...`);
      let teamNumber = await getMaxTeamNumber();
      golferIds = [];
      for (let i = 0; i < golferCount; i++) {
        teamNumber = i % 4 === 0 ? ++teamNumber : teamNumber;
        const golferId = await addGolfer({
          name: 'TBD',
          teamNumber,
          paid: 'Yes'
        });
        golferIds.push(golferId);
        console.log(`  Created golfer ${i + 1}/${golferCount} (Team #${teamNumber})`);
      }
    }
  }

  if (!golferIds) {
    const golferIdsStr = await prompt('Linked Golfer IDs (comma-separated, optional): ');
    golferIds = golferIdsStr ? golferIdsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;
  }

  console.log('\nCreating receipt...');
  const id = await addReceipt({
    payer,
    payerEmail: payerEmail || undefined,
    payerPhone: payerPhone || undefined,
    invoicedAmount,
    itemsPurchased,
    donationAmount,
    sponsorIncome,
    paymentDate,
    receiptType,
    golferIds,
    stripePaymentAmount: receiptType === 'Online - Credit Card' ? invoicedAmount : undefined
  });

  console.log(`Receipt created with ID: ${id}\n`);
}

async function addDepositFlow() {
  console.log('\n--- Add Deposit ---\n');

  const depositNumber = await promptNumber('Deposit Number: ');
  if (!depositNumber) {
    console.log('Deposit number is required.');
    return;
  }

  const depositSource = await prompt('Deposit Source: ');
  if (!depositSource) {
    console.log('Deposit source is required.');
    return;
  }

  const depositDate = await promptDate('Deposit Date (YYYY-MM-DD, Enter for today): ');
  const depositAmount = await promptNumber('Deposit Amount: ');
  if (!depositAmount) {
    console.log('Deposit amount is required.');
    return;
  }

  const auditedAnswer = await prompt('Audited? (y/N): ');
  const audited = auditedAnswer.toLowerCase() === 'y';

  const receiptIdsStr = await prompt('Linked Receipt IDs (comma-separated, optional): ');
  const receiptIds = receiptIdsStr ? receiptIdsStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;

  const note = await prompt('Note (optional): ');

  console.log('\nCreating deposit...');
  const id = await addDeposit({
    depositNumber,
    depositSource,
    depositDate,
    depositAmount,
    audited,
    receiptIds,
    note: note || undefined
  });

  console.log(`Deposit created with ID: ${id}\n`);
}

async function main() {
  console.log('\n=== Airtable Record Manager ===\n');
  console.log('1. Add Golfer');
  console.log('2. Add Receipt');
  console.log('3. Add Deposit');
  console.log('q. Quit\n');

  const choice = await prompt('Select option: ');

  switch (choice) {
    case '1':
      await addGolferFlow();
      break;
    case '2':
      await addReceiptFlow();
      break;
    case '3':
      await addDepositFlow();
      break;
    case 'q':
      console.log('Goodbye!');
      rl.close();
      return;
    default:
      console.log('Invalid option.');
  }

  // Loop back to menu
  await main();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
}).finally(() => {
  rl.close();
});
