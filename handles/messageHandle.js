import { handleIslandCommand } from '../commands/island.js';
import { handleGemstoneCommand } from '../commands/gemstone.js';
import { handleNoticeCommand } from '../commands/notice.js';
import { handleRelicCommand } from '../commands/relic.js';

// 각 명령어별 핸들러를 객체로 분리하여 유지보수성을 높임
const COMMAND_HANDLERS = {
  '!골드섬': handleIslandCommand,
  '!공지': handleNoticeCommand,
  '!보석': handleGemstoneCommand,
  '!유물': handleRelicCommand,
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
