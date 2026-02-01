import { extractGolferMetadata } from '@/utils/golfer-metadata';

describe('extractGolferMetadata', () => {
  it('extracts golfer name and email correctly', () => {
    const metadata = {
      golfer1_name: 'John Doe',
      golfer1_email: 'john@example.com',
    };
    const result = extractGolferMetadata(metadata);
    expect(result).toEqual([{ name: 'John Doe', email: 'john@example.com' }]);
  });

  it('handles multiple golfers', () => {
    const metadata = {
      golfer1_name: 'John Doe',
      golfer1_email: 'john@example.com',
      golfer2_name: 'Jane Doe',
      golfer2_email: 'jane@example.com',
      golfer3_name: 'Bob Smith',
      golfer3_email: 'bob@example.com',
    };
    const result = extractGolferMetadata(metadata);
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
    ]);
  });

  it('handles missing email fields', () => {
    const metadata = {
      golfer1_name: 'John Doe',
      golfer2_name: 'Jane Doe',
      golfer2_email: 'jane@example.com',
    };
    const result = extractGolferMetadata(metadata);
    expect(result).toEqual([
      { name: 'John Doe' },
      { name: 'Jane Doe', email: 'jane@example.com' },
    ]);
  });

  it('handles out-of-order indices', () => {
    const metadata = {
      golfer3_name: 'Bob Smith',
      golfer1_name: 'John Doe',
      golfer2_email: 'jane@example.com',
      golfer2_name: 'Jane Doe',
      golfer1_email: 'john@example.com',
    };
    const result = extractGolferMetadata(metadata);
    expect(result).toEqual([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'jane@example.com' },
      { name: 'Bob Smith' },
    ]);
  });

  it('ignores non-golfer metadata fields', () => {
    const metadata = {
      golfer1_name: 'John Doe',
      golfer1_email: 'john@example.com',
      other_field: 'some value',
      companyname: 'Acme Corp',
    };
    const result = extractGolferMetadata(metadata);
    expect(result).toEqual([{ name: 'John Doe', email: 'john@example.com' }]);
  });

  it('returns empty array for empty metadata', () => {
    const result = extractGolferMetadata({});
    expect(result).toEqual([]);
  });
});
