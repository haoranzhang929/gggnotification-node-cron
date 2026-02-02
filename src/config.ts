import axios from 'axios';
import { Logger } from 'winston';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { scheduleData } from './schedule';

dayjs.extend(weekOfYear);

// Fallback rule (when explicit scheduleData doesn't include the year):
// Bin collection alternates weekly. Use a known reference collection date.
const REFERENCE_COLLECTION_DATE = dayjs('2024-01-02'); // Tuesday
const REFERENCE_BIN: BinType = 'RECYCLING';

export const lisfOfEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'WIFI_PASSWORD',
  'RAPID_API_KEY',
  'RAPID_API_HOST',
  'CRON_SCHEDULE',
  'TIMEZONE',
];

/**
 * Checks for missing environment variables and logs them.
 * @param envVars - List of environment variable names to check.
 * @param logger - Logger instance for logging messages.
 * @returns An array of missing environment variable names.
 */
export const checkEnvVars = (envVars: string[], logger: Logger) => {
  const missingEnvs: string[] = [];
  envVars.forEach((envVar) => {
    if (!process.env[envVar] || process.env[envVar] === 'undefined') {
      logger.error(`Missing ${envVar}`);
      missingEnvs.push(envVar);
    }
  });
  return missingEnvs;
};

// Define available commands
export enum Command {
  Wifi = '/wifi',
  Bin = '/bin',
  DadJoke = '/dad_joke',
  Fortune = '/fortune',
  Dice = '/roll',
}

/**
 * Fetches a random dad joke from the RapidAPI.
 * @returns A string containing the dad joke.
 */
export const dadJokeHandler = async () => {
  const response = await axios.get(
    'https://dad-jokes.p.rapidapi.com/random/joke',
    {
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.RAPID_API_HOST,
      },
    }
  );
  const dataBody = response.data.body;
  const dadJoke = dataBody[0];
  return `😉 Here is your dad joke:\n\n${dadJoke.setup}\n\n${dadJoke.punchline}`;
};

type BinType = 'RECYCLING' | 'LANDFILL_ORGANIC' | 'NONE';

function getNextCollectionDate(from: dayjs.Dayjs): dayjs.Dayjs {
  // Based on scheduleData, collection day is Tuesday.
  // dayjs: Sunday=0 ... Saturday=6, Tuesday=2
  const TUESDAY = 2;
  const dow = from.day();
  const delta = (TUESDAY - dow + 7) % 7;
  return from.add(delta, 'day').startOf('day');
}

function getBinByAlternatingWeeks(date: Date): BinType {
  const target = getNextCollectionDate(dayjs(date));
  const ref = REFERENCE_COLLECTION_DATE.startOf('day');

  const weeksDiff = target.diff(ref, 'week');
  const isEven = Math.abs(weeksDiff) % 2 === 0;
  if (REFERENCE_BIN === 'RECYCLING') {
    return isEven ? 'RECYCLING' : 'LANDFILL_ORGANIC';
  }
  return isEven ? 'LANDFILL_ORGANIC' : 'RECYCLING';
}

/**
 * Determines which bin to collect based on the provided date.
 * @param date - The date to check for bin collection.
 * @returns The type of bin to collect.
 */
export function checkWhichBinToCollect(date: Date = new Date()): BinType {
  const checkDate = dayjs(date);
  const year = checkDate.year().toString();
  const month = (checkDate.month() + 1).toString();
  const day = checkDate.date().toString();

  // Preferred: explicit per-date schedule (when available)
  if (scheduleData[year]?.[month]?.[day]) {
    return scheduleData[year][month][day];
  }

  // Find the next collection day (within the next 7 days) from explicit schedule
  for (let i = 0; i < 7; i++) {
    const nextDate = checkDate.add(i, 'day');
    const nextYear = nextDate.year().toString();
    const nextMonth = (nextDate.month() + 1).toString();
    const nextDay = nextDate.date().toString();

    if (scheduleData[nextYear]?.[nextMonth]?.[nextDay]) {
      return scheduleData[nextYear][nextMonth][nextDay];
    }
  }

  // Fallback: if the year isn't present (e.g. 2026+), infer by weekly alternation.
  // This avoids crashes like `Object.keys(scheduleData[year])` when scheduleData[year] is undefined.
  return getBinByAlternatingWeeks(date);
}

export const formatBinMessage = (binType: BinType): string => {
  switch (binType) {
    case 'RECYCLING':
      return 'Recycling 🟢';
    case 'LANDFILL_ORGANIC':
      return 'General 🟤 + Compost 🟡';
    default:
      return 'Unknown bin type';
  }
};
