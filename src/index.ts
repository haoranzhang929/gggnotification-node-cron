import * as cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';

import { logger } from './logging';
import {
  generateCommandMap,
  checkEnvVars,
  getBinsOfCurrentWeek,
  lisfOfEnvVars,
} from './config';

const createBot = async () => {
  const telegramBot = new TelegramBot(
    process.env.TELEGRAM_BOT_TOKEN as string,
    {
      polling: true,
    }
  );
  return { telegramBot, botInfo: await telegramBot.getMe() };
};

const init = async () => {
  dotenv.config();
  logger.info('Initializing service...');

  const missingEnvs = checkEnvVars(lisfOfEnvVars);
  if (missingEnvs.length > 0) {
    throw new Error(`Missing env vars: ${missingEnvs.join(', ')}`);
  }
  logger.info('Envs checked');

  if (!cron.validate(process.env.CRON_SCHEDULE as string)) {
    const errorMsg = `Invalid cron schedule: ${process.env.CRON_SCHEDULE}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  const { telegramBot, botInfo } = await createBot();

  const CommandMap = generateCommandMap();
  const chatIdMap = new Map<number, TelegramBot.Chat>();

  logger.info('Telegram Bot connected, listening to incoming messages...');
  telegramBot.on('message', async (msg) => {
    if (chatIdMap.get(msg.chat.id) === undefined) {
      chatIdMap.set(msg.chat.id, msg.chat);
    }
    if (msg.text) {
      let messageToSend: string = '',
        parse_mode: TelegramBot.ParseMode | undefined = undefined;
      const commandWithoutSurfix = msg.text.split(`@${botInfo.username}`)[0];
      const commandData = CommandMap.get(commandWithoutSurfix);
      if (commandData?.message) {
        messageToSend = commandData.message;
        parse_mode = commandData.parse_mode;
      }
      if (commandData?.msgHandler) {
        messageToSend = await commandData.msgHandler();
      }
      messageToSend &&
        telegramBot.sendMessage(msg.chat.id, messageToSend, {
          parse_mode,
        });
    }
  });

  const cronJob = cron.schedule(
    process.env.CRON_SCHEDULE as string,
    async () => {
      let alertMessage = `Dont't forget to take out the ${getBinsOfCurrentWeek()} today!`;
      chatIdMap.forEach((chatInfo, chatId) => {
        logger.info(
          `Cron job sending message to ${chatInfo.title}, id: ${chatId}`
        );
        telegramBot.sendMessage(chatId, `🚨 <strong>${alertMessage}</strong>`, {
          parse_mode: 'HTML',
        });
      });
    },
    {
      timezone: process.env.TIMEZONE,
    }
  );
  cronJob.start();
  logger.info('Cron job started');
};

init();
