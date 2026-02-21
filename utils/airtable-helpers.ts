import Airtable, { FieldSet, Records } from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID || '');

export { base };

export async function getMaxTeamNumber(): Promise<number> {
  let maxTeamNumber = 0;

  await base('Golfers').select({
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

export async function isEventProcessed(eventId: string): Promise<boolean> {
  const records = await base('ProcessedWebhooks').select({
    filterByFormula: `{Event ID} = '${eventId}'`,
    maxRecords: 1
  }).firstPage();
  return records.length > 0;
}

export async function markEventProcessed(eventId: string): Promise<void> {
  await base('ProcessedWebhooks').create({
    'Event ID': eventId,
    'Processed At': new Date().toISOString()
  });
}
