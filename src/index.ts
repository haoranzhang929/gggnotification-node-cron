import { schedule, validate } from 'node-cron';
import TelegramBot, { Chat, Message } from 'node-telegram-bot-api';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import timezone from 'dayjs/plugin/timezone';
import { createLogger } from './logging';
import {
  checkEnvVars,
  checkWhichBinToCollect,
  formatBinMessage,
  lisfOfEnvVars,
  Command,
  dadJokeHandler,
} from './config';
import { fortunes } from './fortunes';

dayjs.extend(weekOfYear);
dayjs.extend(timezone);
dayjs.tz.setDefault(process.env.TIMEZONE || 'Europe/Dublin');

config();
const logger = createLogger();

// Define interface for bot and bot information
interface BotInstance {
  telegramBot: TelegramBot;
  botInfo: TelegramBot.User;
}

// Create and initialize the Telegram bot
const createBot = async (): Promise<BotInstance> => {
  try {
    const telegramBot = new TelegramBot(
      process.env.TELEGRAM_BOT_TOKEN as string,
      { polling: true }
    );
    const botInfo = await telegramBot.getMe();
    return { telegramBot, botInfo };
  } catch (error) {
    logger.error('Error initializing Telegram bot: ', { data: error });
    throw new Error('Failed to create Telegram bot');
  }
};

// Handle incoming messages from the bot
const handleIncomingMessage = (
  telegramBot: TelegramBot,
  botInfo: TelegramBot.User,
  chatIdMap: Map<number, Chat>
) => {
  telegramBot.on('message', async (msg: Message) => {
    logger.debug('Message Details: ', { data: msg });

    if (!chatIdMap.has(msg.chat.id)) {
      chatIdMap.set(msg.chat.id, msg.chat);
    }

    const commandWithoutSuffix = msg.text?.split(`@${botInfo.username}`)[0];

    try {
      switch (commandWithoutSuffix) {
        case Command.Wifi:
          telegramBot.sendMessage(
            msg.chat.id,
            `Wi-Fi密码: <code>${process.env.WIFI_PASSWORD}</code>`,
            { parse_mode: 'HTML' }
          );
          break;

        case Command.DadJoke:
          const joke = await dadJokeHandler();
          telegramBot.sendMessage(msg.chat.id, joke);
          break;

        case Command.Bin:
          const today = dayjs().toDate();
          const nextWeek = dayjs().add(7, 'day').toDate();
          telegramBot.sendMessage(
            msg.chat.id,
            `<strong>This Week:</strong> ${formatBinMessage(
              checkWhichBinToCollect(today)
            )}\n<strong>Next Week:</strong> ${formatBinMessage(
              checkWhichBinToCollect(nextWeek)
            )}`,
            { parse_mode: 'HTML' }
          );
          break;

        case Command.Fortune:
          telegramBot.sendMessage(
            msg.chat.id,
            `🔮 Your fortune: ${
              fortunes[Math.floor(Math.random() * fortunes.length)]
            }`
          );

        case '/__testcronmsg':
          const testDate = dayjs().toDate();
          telegramBot.sendMessage(
            msg.chat.id,
            `🚨 🫵 <strong>Don't forget to take out the ${formatBinMessage(
              checkWhichBinToCollect(testDate)
            )} today!</strong>\n\n💦 👀 <strong>Check if the water filter system needs some salt too!</strong>`,
            { parse_mode: 'HTML' }
          );
          break;

        default:
          telegramBot.sendMessage(msg.chat.id, 'Unknown command.');
          break;
      }
    } catch (error) {
      logger.error('Error handling message: ', { data: error });
      telegramBot.sendMessage(
        msg.chat.id,
        'An error occurred. Please try again later.'
      );
    }
  });

  telegramBot.on('polling_error', (error) => {
    logger.error('Telegram bot polling error: ', { data: error });
  });
};

// Start the cron job for scheduled messages
const startCronJob = (
  telegramBot: TelegramBot,
  chatIdMap: Map<number, Chat>
) => {
  try {
    const cronSchedule = process.env.CRON_SCHEDULE as string;

    if (!validate(cronSchedule)) {
      throw new Error(`Invalid cron schedule: ${cronSchedule}`);
    }

    logger.info(
      `Setting up cron job with schedule: ${cronSchedule}, timezone: ${process.env.TIMEZONE}`
    );

    const cronJob = schedule(
      process.env.CRON_SCHEDULE as string,
      () => {
        const today = dayjs().toDate();
        const alertMessage = `🚨 🫵 <strong>Don't forget to take out the ${formatBinMessage(
          checkWhichBinToCollect(today)
        )} today!</strong>\n\n💦 👀 <strong>Check if the water filter system needs some salt too!</strong>`;
        chatIdMap.forEach((chatInfo, chatId) => {
          logger.info(
            `Cron job sending message to ${chatInfo.title}, id: ${chatId}`
          );
          telegramBot.sendMessage(chatId, alertMessage, { parse_mode: 'HTML' });
        });
      },
      { timezone: process.env.TIMEZONE }
    );

    cronJob.start();
    logger.info('Cron job started');
  } catch (error) {
    logger.error('Error starting cron job: ', { data: error });
  }
};

// Initialize the service
const init = async () => {
  logger.info('Initializing service...');
  const missingEnvs = checkEnvVars(lisfOfEnvVars, logger);
  if (missingEnvs.length > 0) {
    throw new Error(`Missing env vars: ${missingEnvs.join(', ')}`);
  }

  const { telegramBot, botInfo } = await createBot();
  const chatIdMap = new Map<number, Chat>();

  handleIncomingMessage(telegramBot, botInfo, chatIdMap);
  startCronJob(telegramBot, chatIdMap);
};

init().catch((error) => {
  logger.error('Initialization failed: ', { data: error });
});

// Express server setup for health checks and root endpoint
const server = express();
const port = process.env.PORT || 3000;

server.get('/health', (_req: Request, res: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  res.send(healthcheck);
});

server.get('/', (_req: Request, res: Response) => {
  res.send({ message: '格里芬幽谷密林小管家api欢迎你' });
});

server.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});
