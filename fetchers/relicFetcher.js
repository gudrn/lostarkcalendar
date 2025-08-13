import { marketAuction } from '../config/config.js';
import { fnFetchRelicFromApi } from '../apis/auctionApi.js';
import { fnMapMarketItem } from '../utils/mapper/relicMapper.js';
import { excluderelics } from '../constants/relics.js';

/**
 * 경매장 API에서 유물 각인서 아이템 목록을 가져와서
 * 제외 각인서 필터링, 중복 제거(최저가 기준), 상위 N개만 반환
 * @returns {Promise<Array>} 유물 각인서 아이템 배열
 */
export const arrMarketRelicsItemFromApi = async () => {
  // 최대 페이지 수와 상위 N개 개수 환경변수에서 읽기 (기본값: 4, 50)
  const maxPages = marketAuction.RELIC_MAX_PAGES;
  const topN = marketAuction.RELIC_TOP_N;

  // 각 페이지별로 API 호출 Promise 배열 생성
  const pagePromises = Array.from({ length: maxPages }, (_, i) => fnFetchRelicFromApi(i + 1));
  const pages = await Promise.all(pagePromises);

  // 모든 페이지 결과 합치고, 매핑 함수 적용
  const merged = pages.flatMap((arrItems) => (arrItems ? arrItems.map(fnMapMarketItem) : []));

  // 제외 각인서 리스트로 필터링
  const filtered = merged.filter((item) => !excluderelics.includes(item.itemName));

  // 아이템명 기준 중복 제거 (더 낮은 최저가 보존)
  const nameToItem = new Map();
  for (const item of filtered) {
    const key = item.itemName;
    const existing = nameToItem.get(key);
    // 더 낮은 최저가를 보존
    if (
      !existing ||
      (item.itemCurrentMinPrice ?? Infinity) < (existing.itemCurrentMinPrice ?? Infinity)
    ) {
      nameToItem.set(key, item);
    }
  }

  // 정렬 생략 (API에서 이미 내림차순 정렬됨)
  // 상위 N개만 반환
  return Array.from(nameToItem.values()).slice(0, topN);
};
