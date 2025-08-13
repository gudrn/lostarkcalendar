import { processRelicItems } from '../processors/relicProcessor.js';

let lastQueryTime = null;

export const handleRelicCommand = async (message) => {
  const currentTime = new Date();
  if (lastQueryTime !== null) {
    const timeDiff = currentTime - lastQueryTime;
    if (timeDiff < 5 * 60 * 1000) {
      await message.channel.send(
        `⏳ 유물 각인서 시세는 ${Math.ceil((5 * 60 * 1000 - timeDiff) / 60000)}분 후에 다시 조회할 수 있습니다.`,
      );
      return;
    }
  }
  lastQueryTime = currentTime;
  try {
    const reply = await processRelicItems();
    if (!reply) {
      await message.channel.send('❌ 유물 각인서 정보를 불러오지 못했습니다.');
      return;
    }
    await message.channel.send({ files: [reply] });
  } catch (err) {
    await message.channel.send('❌ 유물 각인서 정보를 불러오는 중 오류가 발생했습니다.');
  }
};


