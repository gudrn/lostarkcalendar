import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import { scheduleIslandAlerts } from './services/scheduler.js';
import { handleMessage } from './handles/messageHandle.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`✅ 로그인됨: ${client.user.tag}`);
  // 🔔 정식 자동 스케줄 등록
  scheduleIslandAlerts(client);
});

client.on('messageCreate', handleMessage);

client.login(process.env.DISCORD_TOKEN);
