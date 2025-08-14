import { AttachmentBuilder } from 'discord.js';
import { renderTableImage } from './canvas/tableRenderer.js';
import { fnFetchRelicFromApi } from '../apis/relicAutionApi.js';
import { fnMapMarketItem } from '../utils/mapper/relicMapper.js';
import { excluderelics } from '../constants/relics.js';

// 텍스처 깨짐 방지: 폰트 fallback, fontWeight, fontFeatureSettings, fontVariant 등 추가
function createRelicTableImage(data) {
  return renderTableImage(data, {
    headerRowIndex: 0,
  });
}

/**
 * 유물 각인서 시세를 이미지로 만들어 AttachmentBuilder로 반환합니다.
 * @param {Array} relicItems [{ itemName, itemCurrentMinPrice }]
 * @returns {AttachmentBuilder}
 */
export const formatRelicItemsMessage = (relicItems) => {
  // 표 데이터 준비
  const tableData = [
    ['번호', '각인서 이름', '최저가(골드)'],
    ...relicItems.map((item, idx) => [
      (idx + 1).toString(),
      item.itemName,
      item.itemCurrentMinPrice !== undefined &&
      item.itemCurrentMinPrice !== null &&
      item.itemCurrentMinPrice !== ''
        ? Number(item.itemCurrentMinPrice).toLocaleString('ko-KR')
        : '',
    ]),
  ];

  const imageBuffer = createRelicTableImage(tableData);
  const attachment = new AttachmentBuilder(imageBuffer, { name: 'relic_table.png' });

  return attachment;
};

/**
 * 여러 페이지의 유물 각인서 아이템을 API에서 가져와서 하나의 배열로 합칩니다.
 * @param {number} maxPages
 * @returns {Promise<Array>}
 */
export const fetchAllRelicItemsFromApi = async (maxPages) => {
  const pagePromises = Array.from({ length: maxPages }, (_, i) => fnFetchRelicFromApi(i + 1));
  const pages = await Promise.all(pagePromises);
  // 매핑 함수 적용
  return pages.flatMap((arrItems) => (arrItems ? arrItems.map(fnMapMarketItem) : []));
};

/**
 * 제외 각인서 리스트로 필터링합니다.
 * @param {Array} items
 * @returns {Array}
 */
export const filterExcludedRelics = (items) => {
  return items.filter((item) => !excluderelics.includes(item.itemName));
};

/**
 * 아이템명 기준 중복 제거 (더 낮은 최저가 보존)
 * @param {Array} items
 * @returns {Array}
 */
export const dedupeRelicsByNameWithMinPrice = (items) => {
  const nameToItem = new Map();
  for (const item of items) {
    const key = item.itemName;
    const existing = nameToItem.get(key);
    if (
      !existing ||
      (item.itemCurrentMinPrice ?? Infinity) < (existing.itemCurrentMinPrice ?? Infinity)
    ) {
      nameToItem.set(key, item);
    }
  }
  return Array.from(nameToItem.values());
};
