import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

import { checkEnvs, CommandMap } from './config';

dotenv.config();

const createBot = async () => {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== '') {
    const telegramBot = new TelegramBot(
      process.env.TELEGRAM_BOT_TOKEN as string,
      {
        polling: true,
      }
    );
    return { telegramBot, botInfo: await telegramBot.getMe() };
  } else {
    console.error('No token provided');
    process.exit(1);
  }
};

const init = async () => {
  checkEnvs();
  const { telegramBot, botInfo } = await createBot();

  const chatIdMap = new Map<number, string | undefined>();

  telegramBot.on('message', async (msg) => {
    console.log(msg);
    if (chatIdMap.get(msg.chat.id) === undefined) {
      chatIdMap.set(msg.chat.id, msg.chat.title);
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
      if (commandData?.handler) {
        messageToSend = await commandData.handler();
      }
      messageToSend &&
        telegramBot.sendMessage(msg.chat.id, messageToSend, {
          parse_mode,
        });
    }
  });

  // cron.schedule(process.env.CRON_SCHEDULE as string, async () => {
  //   console.log(`cron job runs...`);
  //   const chatIds = Array.from(chatIdMap.keys());
  //   const chatTitles = Array.from(chatIdMap.values());
  //   console.log(chatIds);
  //   console.log(chatTitles);
  //   for (const chatId of chatIds) {
  //     await telegramBot.sendMessage(chatId, 'Fuck you!');
  //   }
  // });
};

init();
