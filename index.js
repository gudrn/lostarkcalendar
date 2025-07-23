import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import { scheduleIslandAlerts } from './services/scheduler.js';
import { getTodayGoldIslands } from './services/islandFetcher.js';
import { getNoticesFromApi } from './services/isNexFetche.js';

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

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!골드섬') {
    const reply = await getTodayGoldIslands(message.content);
    if (!reply) {
      return;
    }

    message.channel.send(
      `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${reply}\n즐거운 로생되세요.\n ----------------------------------------`,
    );
  }

  if (message.content === '!공지') {
    const reply = await getNoticesFromApi();
    if (!reply) {
      return;
    }
    message.channel.send(`${reply}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
