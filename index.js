import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import { scheduleIslandAlerts } from './services/scheduler.js';
import { getTodayGoldIslands, getWeekdata } from './fetchers/islandFetcher.js';
import { getNoticesFromApi } from './apis/isNexFetche.js';
import { getGemstonePrices } from './fetchers/gemstoneFetcher.js';

let time = null;
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
    if (!reply || reply === false) {
      message.channel.send('💰 오늘은 골드 모험섬이 없습니다.');
      return;
    }

    message.channel.send(
      `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${reply}\n즐거운 로생되세요.\n ----------------------------------------`,
    );
  }

  if (message.content === '!공지') {
    const reply = await getNoticesFromApi();
    if (!reply || (Array.isArray(reply) && reply.length === 0)) {
      message.channel.send('📢 오늘은 새로운 공지사항이 없습니다.');
      return;
    }

    // 배열인 경우 첫 번째 링크만 사용
    const noticeLink = Array.isArray(reply) ? reply[0] : reply;
    message.channel.send(`📢 오늘의 공지사항: ${noticeLink}`);
  }

  if (message.content === '!보석') {
    const currentTime = new Date();
    if (time === null) {
      time = currentTime;
    } else {
      const timeDiff = currentTime - time;
      if (timeDiff < 5 * 60 * 1000) {
        message.channel.send(
          `⏳ 보석 시세는 ${Math.ceil(
            (5 * 60 * 1000 - timeDiff) / 60000,
          )}분 후에 다시 조회할 수 있습니다.`,
        );
        return;
      }
    }

    time = currentTime;
    const reply = await getGemstonePrices();
    if (!reply) {
      message.channel.send('❌ 보석 시세를 불러오지 못했습니다.');
      return;
    }
    message.channel.send(`${reply}`);
  }
});

client.login(process.env.DISCORD_TOKEN);
