import axios from 'axios';
import { Logger } from 'winston';
import dayjs from 'dayjs';
import { scheduleData } from './schedule';

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

type BinType = 'LANDFILL' | 'ORGANIC_RECYCLING' | 'NONE';

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

  // Check if today is a collection day
  if (scheduleData[year]?.[month]?.[day]) {
    return scheduleData[year][month][day];
  }

  // Find the next collection day
  for (let i = 0; i < 7; i++) {
    const nextDate = checkDate.add(i, 'day');
    const nextYear = nextDate.year().toString();
    const nextMonth = (nextDate.month() + 1).toString();
    const nextDay = nextDate.date().toString();

    if (scheduleData[nextYear]?.[nextMonth]?.[nextDay]) {
      return scheduleData[nextYear][nextMonth][nextDay];
    }
  }

  // If no collection day found in the next 7 days, return the last known collection type
  const lastKnownMonth = Object.keys(scheduleData[year]).pop() || month;
  const lastKnownDay =
    Object.keys(scheduleData[year][lastKnownMonth]).pop() || '1';
  return scheduleData[year][lastKnownMonth][lastKnownDay];
}

export const formatBinMessage = (binType: BinType): string => {
  switch (binType) {
    case 'LANDFILL':
      return 'General 🟤';
    case 'ORGANIC_RECYCLING':
      return 'Recycling 🟢 + Compost 🟡';
    default:
      return 'Unknown bin type';
  }
};
