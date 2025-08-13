import { AttachmentBuilder } from 'discord.js';
import { renderTableImage } from './canvas/tableRenderer.js';

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
