import { AttachmentBuilder } from 'discord.js';
import { renderTableImage } from './canvas/tableRenderer.js';

// ===== 보석 등급별 그룹화 =====
/**
 * 보석 배열을 등급별로 그룹화합니다.
 * @param {Array} arrGemItems
 * @returns {Object} { [등급]: [보석, ...] }
 */
export function groupGemstonesByGrade(arrGemItems) {
  return arrGemItems.reduce((acc, gem) => {
    const gradeMatch = gem.name.match(/(전설|유물|고대)/);
    const grade = gradeMatch ? gradeMatch[1] : '기타';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(gem);
    return acc;
  }, {});
}

// ===== 보석 시세 표 이미지 생성 =====
/**
 * 등급별로 그룹화된 보석 데이터를 표 이미지로 만듭니다.
 * @param {Object} groupByGrade
 * @returns {Buffer}
 */
function createGemstoneTableImage(groupByGrade) {
  const grades = Object.keys(groupByGrade);
  const tableData = [];
  for (const grade of grades) {
    tableData.push([`${grade} 보석 시세`, '']);
    groupByGrade[grade].forEach((gem) => {
      const nameWithoutGrade = gem.name.replace(/^(전설|유물|고대)\s*/, '');
      tableData.push([
        nameWithoutGrade,
        gem.buyPrice !== undefined && gem.buyPrice !== null && gem.buyPrice !== ''
          ? Number(gem.buyPrice).toLocaleString('ko-KR') + '골드'
          : '',
      ]);
    });
  }
  return renderTableImage(tableData, {
    colCount: 2,
    headerRowIndex: -1,
  });
}

// ===== 보석 시세 이미지 Attachment 반환 =====
/**
 * 그룹화된 보석 데이터를 이미지로 만들어 AttachmentBuilder로 반환합니다.
 * @param {Object} groupByGrade
 * @returns {AttachmentBuilder}
 */
export function formatGemstonePrices(groupByGrade) {
  const imageBuffer = createGemstoneTableImage(groupByGrade);
  return new AttachmentBuilder(imageBuffer, { name: 'gemstone_table.png' });
}
