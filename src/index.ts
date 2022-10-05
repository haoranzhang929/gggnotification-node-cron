import * as cron from 'node-cron';
import TelegramBot from 'node-telegram-bot-api';

import { checkEnvsAndGenerateCommandMap, getBinsOfCurrentWeek } from './config';

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
  console.log('Initializing service...\n');
  const CommandMap = checkEnvsAndGenerateCommandMap();
  console.log('Envs checked\n');

  if (!cron.validate(process.env.CRON_SCHEDULE as string)) {
    throw new Error('Invalid CRON_SCHEDULE\n');
  }

  const { telegramBot, botInfo } = await createBot();

  const chatIdMap = new Map<number, TelegramBot.User>();

  console.log('Telegram Bot connected, listening to incoming messages...\n');
  telegramBot.on('message', async (msg) => {
    if (chatIdMap.get(msg.chat.id) === undefined) {
      chatIdMap.set(msg.chat.id, botInfo);
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
      console.log(`Cron job runs at ${new Date().toISOString()}`);
      let alertMessage = `Dont't forget to take out the ${getBinsOfCurrentWeek()} today!`;
      chatIdMap.forEach((_, chatId) => {
        telegramBot.sendMessage(chatId, `🚨 <strong>${alertMessage}</strong>`, {
          parse_mode: 'HTML',
        });
      });
    }
  );
  cronJob.start();
  console.log('Cron job started\n');
};

init();
