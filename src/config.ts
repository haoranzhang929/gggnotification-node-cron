import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

import { logger } from './logging';

export const lisfOfEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'WIFI_PASSWORD',
  'RAPID_API_KEY',
  'RAPID_API_HOST',
  'CRON_SCHEDULE',
  'TIMEZONE',
];

export const checkEnvVars = (envVars: string[]) => {
  const missingEnvs: string[] = [];
  envVars.forEach((envVar) => {
    if (!process.env[envVar] || process.env[envVar] === 'undefined') {
      logger.error(`Missing ${envVar}`);
      missingEnvs.push(envVar);
    }
  });
  return missingEnvs;
};

export const generateCommandMap = () =>
  new Map<
    string,
    {
      message?: string;
      parse_mode?: TelegramBot.ParseMode;
      msgHandler?: () => Promise<string>;
    }
  >([
    [
      '/wifi',
      {
        message: `Wi-Fi密码:   <code>${process.env.WIFI_PASSWORD}</code>`,
        parse_mode: 'HTML',
      },
    ],
    ['/bin', { message: `你个小垃圾，这个功能还没做好` }],
    [
      '/dad_joke',
      {
        msgHandler: dadJokeHandler,
      },
    ],
  ]);

const dadJokeHandler = async () => {
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

const getCurrentWeekOfMonth = (data: Date = new Date()) => {
  const firstDay = new Date(data.getFullYear(), data.getMonth(), 1);
  const dayOfWeek = firstDay.getDay();
  const spendDay = 1;
  if (dayOfWeek !== 0) {
    return Math.ceil((spendDay + dayOfWeek) / 7);
  } else {
    return Math.ceil(spendDay / 7);
  }
};

export const getBinsOfCurrentWeek = () => {
  const isEvenWeek = getCurrentWeekOfMonth() % 2 === 0;
  return isEvenWeek ? 'general 🟤 bin' : 'organic 🔴 + recycling 🟢 bins';
};
