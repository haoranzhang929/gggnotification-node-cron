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
});
