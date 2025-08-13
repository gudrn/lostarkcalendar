import { processRelicItems } from '../processors/relicProcessor.js';
import { getGemstonePrices } from '../fetchers/gemstoneFetcher.js';

// 각 핸들러별로 쿨타임을 분리하여 관리
let lastRelicQueryTime = null;
let lastGemstoneQueryTime = null;

/**
 * 유물 각인서 시세 조회 명령어 핸들러
 * 5분 쿨타임이 적용되며, 쿨타임 내에는 남은 시간을 안내합니다.
 * @param {Object} message - Discord 메시지 객체
 * @returns {Promise<void>}
 */
export const handleRelicCommand = async (message) => {
  const currentTime = new Date();
  if (lastRelicQueryTime !== null) {
    const timeDiff = currentTime - lastRelicQueryTime;
    if (timeDiff < 5 * 60 * 1000) {
      await message.channel.send(
        `⏳ 유물 각인서 시세는 ${Math.ceil(
          (5 * 60 * 1000 - timeDiff) / 60000,
        )}분 후에 다시 조회할 수 있습니다.`,
      );
      return;
    }
  }
  lastRelicQueryTime = currentTime;
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

/**
 * 보석 시세 조회 명령어 핸들러
 * 5분 쿨타임이 적용되며, 쿨타임 내에는 남은 시간을 안내합니다.
 * @param {Object} message - Discord 메시지 객체
 * @returns {Promise<void>}
 */
export const handleGemstoneCommand = async (message) => {
  const currentTime = new Date();
  if (lastGemstoneQueryTime !== null) {
    const timeDiff = currentTime - lastGemstoneQueryTime;
    if (timeDiff < 5 * 60 * 1000) {
      await message.channel.send(
        `⏳ 보석 시세는 ${Math.ceil(
          (5 * 60 * 1000 - timeDiff) / 60000,
        )}분 후에 다시 조회할 수 있습니다.`,
      );
      return;
    }
  }
  lastGemstoneQueryTime = currentTime;
  const reply = await getGemstonePrices();
  if (!reply) {
    await message.channel.send('❌ 보석 시세를 불러오지 못했습니다.');
    return;
  }
  await message.channel.send({ files: [reply] });
};
