import { getTodayGoldIslands } from '../fetchers/islandFetcher.js';
import { getGemstonePrices } from '../fetchers/gemstoneFetcher.js';
import { getNoticesFromApi } from '../apis/isNexFetche.js';

// 각 명령어별 핸들러를 객체로 분리하여 유지보수성을 높임
const COMMAND_HANDLERS = {
  '!골드섬': async (message) => {
    const reply = await getTodayGoldIslands(message.content);
    if (!reply || reply === false) {
      await message.channel.send('💰 오늘은 골드 모험섬이 없습니다.');
      return;
    }
    await message.channel.send(
      `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${reply}\n즐거운 로생되세요.\n ----------------------------------------`,
    );
  },

  '!공지': async (message) => {
    const reply = await getNoticesFromApi();
    if (!reply || (Array.isArray(reply) && reply.length === 0)) {
      await message.channel.send('📢 오늘은 새로운 공지사항이 없습니다.');
      return;
    }
    // 배열인 경우 첫 번째 링크만 사용
    const noticeLink = Array.isArray(reply) ? reply[0] : reply;
    await message.channel.send(`📢 오늘의 공지사항: ${noticeLink}`);
  },

  '!보석': (() => {
    // 클로저로 시간 상태를 유지
    let lastQueryTime = null;
    return async (message) => {
      const currentTime = new Date();
      if (lastQueryTime !== null) {
        const timeDiff = currentTime - lastQueryTime;
        if (timeDiff < 5 * 60 * 1000) {
          await message.channel.send(
            `⏳ 보석 시세는 ${Math.ceil(
              (5 * 60 * 1000 - timeDiff) / 60000,
            )}분 후에 다시 조회할 수 있습니다.`,
          );
          return;
        }
      }
      lastQueryTime = currentTime;
      const reply = await getGemstonePrices();
      if (!reply) {
        await message.channel.send('❌ 보석 시세를 불러오지 못했습니다.');
        return;
      }
      await message.channel.send(`${reply}`);
    };
  })(),
};

export async function handleMessage(message) {
  if (message.author.bot) return;

  const handler = COMMAND_HANDLERS[message.content];
  if (handler) {
    try {
      await handler(message);
    } catch (err) {
      console.error('❌ 명령어 처리 중 오류:', err);
      await message.channel.send('❌ 명령어 처리 중 오류가 발생했습니다.');
    }
  }
}
