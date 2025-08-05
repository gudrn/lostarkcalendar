import { fnFetchRelicFromApi } from '../apis/auctionApi.js';
import { fnMapMarketItem } from '../utils/mapper/RelicMapper.js';
import { excluderelics } from '../constants/data.js';
// 유물 아이템(각인서 등) 마켓 데이터를 외부 API에서 1~4페이지까지 조회하여 정제된 배열로 반환
export const arrMarketRelicsItemFromApi = async () => {
  const arrAllItems = (
    await Promise.all(Array.from({ length: 4 }, (_, i) => fnFetchRelicFromApi(i + 1)))
  ).flatMap((arrItems) => (arrItems ? arrItems.map(fnMapMarketItem) : []));
  // 제외 리스트에 없는 것만 필터링
  return arrAllItems.filter((item) => !excluderelics.includes(item.itemName));
};
