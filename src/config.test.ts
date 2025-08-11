import dayjs from 'dayjs';
import { checkWhichBinToCollect } from './config';

describe('checkWhichBinToCollect', () => {
  test.each([
    ['2024-01-01', 'RECYCLING'], // Day before collection
    ['2024-01-02', 'RECYCLING'], // Collection day
    ['2024-01-03', 'LANDFILL_ORGANIC'], // Day after collection
    ['2024-01-09', 'LANDFILL_ORGANIC'],
    ['2024-01-16', 'RECYCLING'],
    ['2024-01-23', 'LANDFILL_ORGANIC'],
    ['2024-01-30', 'RECYCLING'],
    ['2024-02-05', 'LANDFILL_ORGANIC'], // Day before collection
    ['2024-02-06', 'LANDFILL_ORGANIC'], // Collection day
    ['2024-02-07', 'RECYCLING'], // Day after collection
    ['2024-02-13', 'RECYCLING'],
    ['2024-02-20', 'LANDFILL_ORGANIC'],
    ['2024-02-27', 'RECYCLING'],
    ['2025-01-06', 'LANDFILL_ORGANIC'], // Day before collection
    ['2025-01-07', 'LANDFILL_ORGANIC'], // Collection day
    ['2025-01-08', 'RECYCLING'], // Day after collection
    ['2025-01-14', 'RECYCLING'],
    ['2025-01-21', 'LANDFILL_ORGANIC'],
    ['2025-01-28', 'RECYCLING'],
    ['2025-02-03', 'LANDFILL_ORGANIC'], // Day before collection
    ['2025-02-04', 'LANDFILL_ORGANIC'], // Collection day
    ['2025-02-05', 'RECYCLING'], // Day after collection
    ['2025-02-11', 'RECYCLING'],
    ['2025-02-18', 'LANDFILL_ORGANIC'],
    ['2025-02-25', 'RECYCLING'],
    // Add more test cases as needed
  ])('should return correct bin type for %s', (dateString, expected) => {
    expect(checkWhichBinToCollect(dayjs(dateString).toDate())).toBe(expected);
  });

  test('Non-Tuesday dates', () => {
    expect(checkWhichBinToCollect(dayjs('2024-07-01').toDate())).toBe(
      'RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-03').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-04').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-05').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-06').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-07').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
  });

  test('Non-Tuesday dates 2025', () => {
    expect(checkWhichBinToCollect(dayjs('2025-07-01').toDate())).toBe(
      'RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-02').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-03').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-04').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-05').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-06').toDate())).toBe(
      'LANDFILL_ORGANIC'
    );
  });
});
