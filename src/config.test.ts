import dayjs from 'dayjs';
import { checkWhichBinToCollect } from './config';

describe('checkWhichBinToCollect', () => {
  test.each([
    ['2024-01-01', 'LANDFILL'], // Day before collection
    ['2024-01-02', 'LANDFILL'], // Collection day
    ['2024-01-03', 'ORGANIC_RECYCLING'], // Day after collection
    ['2024-01-09', 'ORGANIC_RECYCLING'],
    ['2024-01-16', 'LANDFILL'],
    ['2024-01-23', 'ORGANIC_RECYCLING'],
    ['2024-01-30', 'LANDFILL'],
    ['2024-02-05', 'ORGANIC_RECYCLING'], // Day before collection
    ['2024-02-06', 'ORGANIC_RECYCLING'], // Collection day
    ['2024-02-07', 'LANDFILL'], // Day after collection
    ['2024-02-13', 'LANDFILL'],
    ['2024-02-20', 'ORGANIC_RECYCLING'],
    ['2024-02-27', 'LANDFILL'],
    ['2025-01-06', 'ORGANIC_RECYCLING'], // Day before collection
    ['2025-01-07', 'ORGANIC_RECYCLING'], // Collection day
    ['2025-01-08', 'LANDFILL'], // Day after collection
    ['2025-01-14', 'LANDFILL'],
    ['2025-01-21', 'ORGANIC_RECYCLING'],
    ['2025-01-28', 'LANDFILL'],
    ['2025-02-03', 'ORGANIC_RECYCLING'], // Day before collection
    ['2025-02-04', 'ORGANIC_RECYCLING'], // Collection day
    ['2025-02-05', 'LANDFILL'], // Day after collection
    ['2025-02-11', 'LANDFILL'],
    ['2025-02-18', 'ORGANIC_RECYCLING'],
    ['2025-02-25', 'LANDFILL'],
    // Add more test cases as needed
  ])('should return correct bin type for %s', (dateString, expected) => {
    expect(checkWhichBinToCollect(dayjs(dateString).toDate())).toBe(expected);
  });

  test('Non-Tuesday dates', () => {
    expect(checkWhichBinToCollect(dayjs('2024-07-01').toDate())).toBe(
      'LANDFILL'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-03').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-04').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-05').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-06').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2024-07-07').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
  });

  test('Non-Tuesday dates 2025', () => {
    expect(checkWhichBinToCollect(dayjs('2025-07-01').toDate())).toBe(
      'LANDFILL'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-02').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-03').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-04').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-05').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
    expect(checkWhichBinToCollect(dayjs('2025-07-06').toDate())).toBe(
      'ORGANIC_RECYCLING'
    );
  });
});
