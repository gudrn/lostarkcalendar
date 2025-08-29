import { DISCORD_TOKEN } from './config/config.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { scheduleIslandAlerts } from './services/scheduler.js';
import { handleMessage, handle as interactionHandle } from './handles/messageHandle.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`✅ 로그인됨: ${client.user.tag}`);
  // 현재 시간을 한국 시간(KST) 기준으로 출력
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  console.log(`⏰ 현재 KST 시간: ${kstNow.toISOString().replace('T', ' ').substring(0, 19)}`);
  // 🔔 정식 자동 스케줄 등록
  scheduleIslandAlerts(client);
});

client.on('messageCreate', handleMessage);
client.on('interactionCreate', interactionHandle.execute);

client.login(DISCORD_TOKEN);
