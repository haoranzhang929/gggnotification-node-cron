import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

export const checkEnvs = () => {
  const missingEnvs: string[] = [];
  if (
    process.env.TELEGRAM_BOT_TOKEN === undefined ||
    process.env.TELEGRAM_BOT_TOKEN === ''
  ) {
    console.error('Missing TELEGRAM_BOT_TOKEN');
    missingEnvs.push('TELEGRAM_BOT_TOKEN');
  }

  if (
    process.env.WIFI_PASSWORD === undefined ||
    process.env.WIFI_PASSWORD === ''
  ) {
    console.error('Missing WIFI_PASSWORD');
    missingEnvs.push('WIFI_PASSWORD');
  }

  if (
    process.env.RAPID_API_KEY === undefined ||
    process.env.RAPID_API_KEY === ''
  ) {
    console.error('Missing RAPID_API_KEY');
    missingEnvs.push('RAPID_API_KEY');
  }

  if (
    process.env.RAPID_API_HOST === undefined ||
    process.env.RAPID_API_HOST === ''
  ) {
    console.error('Missing RAPID_API_HOST');
    missingEnvs.push('RAPID_API_HOST');
  }

  if (
    process.env.CRON_SCHEDULE === undefined ||
    process.env.CRON_SCHEDULE === ''
  ) {
    console.error('Missing CRON_SCHEDULE');
    missingEnvs.push('CRON_SCHEDULE');
  }

  if (missingEnvs.length > 0) {
    throw new Error(`Missing envs: ${missingEnvs.join(', ')}`);
  }
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

export const CommandMap = new Map<
  string,
  {
    message?: string;
    parse_mode?: TelegramBot.ParseMode;
    handler?: () => Promise<string>;
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
      handler: dadJokeHandler,
    },
  ],
]);
