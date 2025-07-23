import schedule from 'node-schedule';
import { getTodayGoldIslands } from './islandFetcher.js';
import dotenv from 'dotenv';
import { getNoticesFromApi } from './isNexFetche.js';
dotenv.config();

/**
 * 골드 모험섬 알림 메시지 전송 함수
 */
const sendIslandMessage = async (client) => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    const message = await getTodayGoldIslands();
    if (!message) {
      return;
    }
    await channel.send(
      `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${message}\n즐거운 로생되세요.\n ----------------------------------------`,
    );
  } catch (err) {
    console.error('❌ 자동 알림 전송 실패:', err);
  }
};

const sendNotice = async (client) => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID2);
    const message = await getNoticesFromApi();
    if (!message) {
      return;
    }
    await channel.send(`${message}`);
  } catch (err) {
    console.error('❌ 자동 알림 전송 실패(공지):', err);
  }
};
/**
 * 스케줄 등록 함수
 */
export const scheduleIslandAlerts = (client) => {
  // 매일 12시 30분에 알림
  schedule.scheduleJob('30 12 * * *', () => sendIslandMessage(client));
  // 매일 20시 55분에 알림
  schedule.scheduleJob('55 20 * * *', () => sendIslandMessage(client));
  // 매주 수요일 10시 5분에 알림
  schedule.scheduleJob('2 10 * * 3', () => sendNotice(client));
};
