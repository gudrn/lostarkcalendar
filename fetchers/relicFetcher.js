import { marketAuction } from '../config/config.js';
import {
  fetchAllRelicItemsFromApi,
  filterExcludedRelics,
  dedupeRelicsByNameWithMinPrice,
} from '../utils/relicUtil.js';

/**
 * 경매장 API에서 유물 각인서 아이템 목록을 가져와서
 * 제외 각인서 필터링, 중복 제거(최저가 기준), 상위 N개만 반환
 * @returns {Promise<Array>} 유물 각인서 아이템 배열
 */
export const arrMarketRelicsItemFromApi = async () => {
  const maxPages = marketAuction.RELIC_MAX_PAGES;
  const topN = marketAuction.RELIC_TOP_N;

  // 1. 모든 페이지의 유물 각인서 아이템 가져오기
  const allItems = await fetchAllRelicItemsFromApi(maxPages);

  // 2. 제외 각인서 필터링
  const filtered = filterExcludedRelics(allItems);

  // 3. 아이템명 기준 중복 제거 (최저가 보존)
  const deduped = dedupeRelicsByNameWithMinPrice(filtered);

  // 4. 상위 N개만 반환
  return deduped.slice(0, topN);
};
