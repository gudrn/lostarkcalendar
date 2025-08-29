import { getTodayGoldIslands } from '../fetchers/islandFetcher.js';
import { roleToggle } from '../utils/roleToggle.js';

/**
 * 모험섬 명령어를 처리하는 함수
 * @param {*} message - 디스코드 메시지 객체
 * @returns {Promise<void>}
 */
export const handleIslandCommand = async (message) => {
  const reply = await getTodayGoldIslands(message.content);
  if (!reply || reply === false) return;

  await message.channel.send(
    `<@&${roleToggle.ROLE_ID}> \n⏰ 오늘 골드를 주는 모험섬\n${reply}\n즐거운 로생되세요.\n ----------------------------------------`,
  );
};
