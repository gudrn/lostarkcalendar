import dotenv from 'dotenv';
import { fnFetchRelicFromApi } from '../apis/auctionApi.js';
import { fnMapMarketItem } from '../utils/mapper/relicMapper.js';
import { excluderelics } from '../constants/relics.js';
dotenv.config();

// 유물 아이템(각인서 등) 마켓 데이터를 외부 API에서 조회하여 정제된 배열로 반환
// 환경변수:
// - RELIC_MAX_PAGES: 페이지 조회 수(기본 4)
// - RELIC_TOP_N: 최종 상위 N개만 반환(가격 오름차순, 기본 50)
export const arrMarketRelicsItemFromApi = async () => {
  const maxPages = Number.parseInt(process.env.RELIC_MAX_PAGES, 10) || 4;
  const topN = Number.parseInt(process.env.RELIC_TOP_N, 10) || 50;

  const pagePromises = Array.from({ length: maxPages }, (_, i) => fnFetchRelicFromApi(i + 1));
  const pages = await Promise.all(pagePromises);

  // 페이지 합치기 + 매핑
  const merged = pages.flatMap((arrItems) => (arrItems ? arrItems.map(fnMapMarketItem) : []));

  // 제외 리스트 필터링
  const filtered = merged.filter((item) => !excluderelics.includes(item.itemName));

  // 중복 제거(아이템명 기준)
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

  // 정렬(최저가 오름차순)
  const deduped = Array.from(nameToItem.values()).sort((a, b) => {
    const av = a.itemCurrentMinPrice ?? Number.POSITIVE_INFINITY;
    const bv = b.itemCurrentMinPrice ?? Number.POSITIVE_INFINITY;
    return av - bv;
  });

  // 상위 N개 제한
  return deduped.slice(0, topN);
};
