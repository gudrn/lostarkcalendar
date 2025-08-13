import { arrMarketRelicsItemFromApi } from '../fetchers/relicFetcher.js';
import { formatRelicItemsMessage } from '../utils/relicUtil.js';

/**
 * 유물 각인서 시세 데이터를 가져와서 메시지로 반환하는 함수
 * @returns {Promise<string|null>} 유물 각인서 메시지 또는 null
 */
export const processRelicItems = async () => {
  try {
    const relicItems = await arrMarketRelicsItemFromApi();
    return formatRelicItemsMessage(relicItems);
  } catch (error) {
    console.error('❌ 유물 각인서 처리 중 오류:', error);
    return null;
  }
};
