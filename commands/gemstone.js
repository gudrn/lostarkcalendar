import { getGemstonePrices } from '../fetchers/gemstoneFetcher.js';

let lastQueryTime = null;

export const handleGemstoneCommand = async (message) => {
  const currentTime = new Date();
  if (lastQueryTime !== null) {
    const timeDiff = currentTime - lastQueryTime;
    if (timeDiff < 5 * 60 * 1000) {
      await message.channel.send(
        `⏳ 보석 시세는 ${Math.ceil((5 * 60 * 1000 - timeDiff) / 60000)}분 후에 다시 조회할 수 있습니다.`,
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
  await message.channel.send({ files: [reply] });
};


