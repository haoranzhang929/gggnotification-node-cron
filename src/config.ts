import axios from 'axios';
import { Logger } from 'winston';
import dayjs from 'dayjs';

export const lisfOfEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'WIFI_PASSWORD',
  'RAPID_API_KEY',
  'RAPID_API_HOST',
  'CRON_SCHEDULE',
  'TIMEZONE',
];

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

export enum Command {
  Wifi = '/wifi',
  Bin = '/bin',
  DadJoke = '/dad_joke',
}

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

const binsList = ['General 🟤', 'Recycling 🟢', 'Compost 🟡'];

export const checkWhichBinToCollect = (isEvenWeek: boolean) =>
  isEvenWeek ? binsList[0] : binsList.slice(1).join(' + ');

export const isEvenWeek = (date: Date | string = new Date()) => {
  const isWeekEven = dayjs(date).week() % 2 === 0;
  const isYearEven = dayjs(date).year() % 2 === 0;
  return isYearEven ? isWeekEven : !isWeekEven;
};
