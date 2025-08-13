import { getTodayGoldIslands } from '../fetchers/islandFetcher.js';

export const handleIslandCommand = async (message) => {
  const reply = await getTodayGoldIslands(message.content);
  if (!reply || reply === false) {
    await message.channel.send('💰 오늘은 골드 모험섬이 없습니다.');
    return;
  }
  await message.channel.send(
    `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${reply}\n즐거운 로생되세요.\n ----------------------------------------`,
  );
};


