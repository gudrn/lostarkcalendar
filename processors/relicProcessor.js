import { arrMarketRelicsItemFromApi } from '../fetchers/relicFetcher.js';
import { formatRelicItemsMessage } from '../utils/relicUtil.js';

export const processRelicItems = async () => {
  try {
    const relicItems = await arrMarketRelicsItemFromApi();
    return formatRelicItemsMessage(relicItems);
  } catch (error) {
    console.error('유물 각인서 처리 중 오류:', error);
    return null;
  }
};
