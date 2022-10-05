import { schedule, validate } from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import express from 'express';

import { createLogger } from './logging';
import {
  checkEnvVars,
  checkWhichBinToCollect,
  getWeekOfMonth,
  lisfOfEnvVars,
  Command,
  dadJokeHandler,
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

config();
const logger = createLogger();

const init = async () => {
  logger.info('Initializing service...');

  const missingEnvs = checkEnvVars(lisfOfEnvVars, logger);
  if (missingEnvs.length > 0) {
    throw new Error(`Missing env vars: ${missingEnvs.join(', ')}`);
  }
  if (!validate(process.env.CRON_SCHEDULE as string)) {
    const errorMsg = `Invalid cron schedule: ${process.env.CRON_SCHEDULE}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  logger.info('Env var validated');

  const { telegramBot, botInfo } = await createBot();

  const chatIdMap = new Map<number, TelegramBot.Chat>();

  logger.info('Telegram Bot connected, listening to incoming messages...');
  telegramBot.on('message', async (msg) => {
    logger.debug('Message Details: ', { data: msg });
    if (chatIdMap.get(msg.chat.id) === undefined) {
      chatIdMap.set(msg.chat.id, msg.chat);
    }
    if (msg.text) {
      const commandWithoutSurfix = msg.text.split(`@${botInfo.username}`)[0];

      switch (commandWithoutSurfix) {
        case Command.Wifi:
          telegramBot.sendMessage(
            msg.chat.id,
            `Wi-Fi密码:   <code>${process.env.WIFI_PASSWORD}</code>`,
            { parse_mode: 'HTML' }
          );
          break;
        case Command.DadJoke:
          try {
            telegramBot.sendMessage(msg.chat.id, await dadJokeHandler());
          } catch (error) {
            logger.error('Error when calling dad joke API: ', { data: error });
            telegramBot.sendMessage(
              msg.chat.id,
              'Sorry, I am not feeling like telling joke now. Please try again later.'
            );
          }
          break;
        case Command.Bin:
          telegramBot.sendMessage(
            msg.chat.id,
            `<strong>This Week:</strong> ${checkWhichBinToCollect(
              getWeekOfMonth() % 2 === 0
            )}\n<strong>Next Week:</strong> ${checkWhichBinToCollect(
              getWeekOfMonth() % 2 !== 0
            )}`,
            {
              parse_mode: 'HTML',
            }
          );
          break;
      }
    }
  });

  telegramBot.on('polling_error', (error) => {
    logger.error('Telegrame bot polling error: ', { data: error });
  });

  const cronJob = schedule(
    process.env.CRON_SCHEDULE as string,
    async () => {
      let alertMessage = `Dont't forget to take out the ${checkWhichBinToCollect(
        getWeekOfMonth() % 2 === 0
      )} bin today!`;
      chatIdMap.forEach((chatInfo, chatId) => {
        logger.info(
          `Cron job sending message to ${chatInfo.title}, id: ${chatId}`
        );
        logger.debug(`Chat Info: `, { data: chatInfo });
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

const server = express();
const port = process.env.PORT || 3000;

server.get('/health', (_req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error as string;
    res.status(503).send();
  }
});

server.listen(port, () => {
  logger.info(`Server listening on port: ${port}`);
});
