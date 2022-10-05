import axios from 'axios';
import { Logger } from 'winston';

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

export const getWeekOfMonth = (data: Date = new Date()) => {
  const firstDay = new Date(data.getFullYear(), data.getMonth(), 1);
  const dayOfWeek = firstDay.getDay();
  const spendDay = 1;
  if (dayOfWeek !== 0) {
    return Math.ceil((spendDay + dayOfWeek) / 7);
  } else {
    return Math.ceil(spendDay / 7);
  }
};

const binsList = ['General 🟤', 'Recycling 🟢', 'Compost 🟡'];

export const checkWhichBinToCollect = (isEvenWeek: boolean) =>
  isEvenWeek ? binsList[0] : binsList.slice(1).join(' + ');
