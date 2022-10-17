import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import timezone from 'dayjs/plugin/timezone';
import { checkWhichBinToCollect, isEvenWeek } from './config';

dayjs.extend(weekOfYear);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Dublin');

const General = 'General 🟤';
const RecyclingCompose = 'Recycling 🟢 + Compost 🟡';

describe('checkWhichBinToCollect', () => {
  it('should return the correct bin to collect', () => {
    expect(checkWhichBinToCollect(true)).toBe(General);
    expect(checkWhichBinToCollect(false)).toBe(RecyclingCompose);
  });

  it('should return the correct bin on correct date string', () => {
    expect(checkWhichBinToCollect(isEvenWeek('2022-01-04'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-01-25'))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek('2022-08-02'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-08-16'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-08-23'))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek('2022-11-01'))).toBe(
      RecyclingCompose
    );
    expect(checkWhichBinToCollect(isEvenWeek('2022-11-08'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-11-15'))).toBe(
      RecyclingCompose
    );
    expect(checkWhichBinToCollect(isEvenWeek('2022-11-22'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-11-29'))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek('2022-12-06'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2023-01-03'))).toBe(General);
    expect(checkWhichBinToCollect(isEvenWeek('2022-12-13'))).toBe(
      RecyclingCompose
    );
  });

  it('should return the correct bin on correct date object', () => {
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 1, 4)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 1, 25)))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 8, 2)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 8, 16)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 8, 23)))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 11, 1)))).toBe(
      RecyclingCompose
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 11, 8)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 11, 15)))).toBe(
      RecyclingCompose
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 11, 22)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 11, 29)))).toBe(
      RecyclingCompose
    );

    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 12, 6)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2023, 1, 3)))).toBe(
      General
    );
    expect(checkWhichBinToCollect(isEvenWeek(new Date(2022, 12, 13)))).toBe(
      RecyclingCompose
    );
  });
});
