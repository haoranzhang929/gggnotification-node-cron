import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import * as dotenv from 'dotenv';

export const checkEnvsAndGenerateCommandMap = () => {
  dotenv.config();
  const missingEnvs: string[] = [];
  if (
    process.env.TELEGRAM_BOT_TOKEN === undefined ||
    process.env.TELEGRAM_BOT_TOKEN === '' ||
    process.env.TELEGRAM_BOT_TOKEN === 'undefined'
  ) {
    console.error('Missing TELEGRAM_BOT_TOKEN');
    missingEnvs.push('TELEGRAM_BOT_TOKEN');
  }

  if (
    process.env.WIFI_PASSWORD === undefined ||
    process.env.WIFI_PASSWORD === '' ||
    process.env.WIFI_PASSWORD === 'undefined'
  ) {
    console.error('Missing WIFI_PASSWORD');
    missingEnvs.push('WIFI_PASSWORD');
  }

  if (
    process.env.RAPID_API_KEY === undefined ||
    process.env.RAPID_API_KEY === '' ||
    process.env.RAPID_API_KEY === 'undefined'
  ) {
    console.error('Missing RAPID_API_KEY');
    missingEnvs.push('RAPID_API_KEY');
  }

  if (
    process.env.RAPID_API_HOST === undefined ||
    process.env.RAPID_API_HOST === '' ||
    process.env.TELEGRAM_BOT_TOKEN === 'undefined'
  ) {
    console.error('Missing RAPID_API_HOST');
    missingEnvs.push('RAPID_API_HOST');
  }

  if (
    process.env.CRON_SCHEDULE === undefined ||
    process.env.CRON_SCHEDULE === '' ||
    process.env.CRON_SCHEDULE === 'undefined'
  ) {
    console.error('Missing CRON_SCHEDULE');
    missingEnvs.push('CRON_SCHEDULE');
  }

  if (missingEnvs.length > 0) {
    throw new Error(`Missing envs: ${missingEnvs.join(', ')}`);
  }

  return new Map<
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
};

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

export const getCurrentWeekOfMonth = (data: Date = new Date()) => {
  const firstDay = new Date(data.getFullYear(), data.getMonth(), 1);
  const dayOfWeek = firstDay.getDay();
  const spendDay = 1;
  if (dayOfWeek !== 0) {
    return Math.ceil((spendDay + dayOfWeek) / 7);
  } else {
    return Math.ceil(spendDay / 7);
  }
};
