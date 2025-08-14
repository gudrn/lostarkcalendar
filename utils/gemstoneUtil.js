import { AttachmentBuilder } from 'discord.js';
import { renderTableImage } from './canvas/tableRenderer.js';
import { fnFetchEnGemstoneFromApi } from '../apis/relicAutionApi.js';
import { gemstones } from '../constants/gemstones.js';

// ===== 보석 등급별 그룹화 =====
/**
 * 보석 배열을 등급별로 그룹화합니다.
 * @param {Array} arrGemItems
 * @returns {Object} { [등급]: [보석, ...] }
 */
export const groupGemstonesByGrade = (arrGemItems) =>
  arrGemItems.reduce((acc, gem) => {
    const gradeMatch = gem.name.match(/(전설|유물|고대)/);
    const grade = gradeMatch ? gradeMatch[1] : '기타';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(gem);
    return acc;
  }, {});

// ===== 보석 시세 표 이미지 생성 =====
/**
 * 등급별로 그룹화된 보석 데이터를 표 이미지로 만듭니다.
 * @param {Object} groupByGrade
 * @returns {Buffer}
 */
const createGemstoneTableImage = (groupByGrade) => {
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
};

// ===== 보석 시세 이미지 Attachment 반환 =====
/**
 * 그룹화된 보석 데이터를 이미지로 만들어 AttachmentBuilder로 반환합니다.
 * @param {Object} groupByGrade
 * @returns {AttachmentBuilder}
 */
export const formatGemstonePrices = (groupByGrade) => {
  const imageBuffer = createGemstoneTableImage(groupByGrade);
  return new AttachmentBuilder(imageBuffer, { name: 'gemstone_table.png' });
};

/**
 * 조회할 보석 조합을 생성하는 함수
 * @returns {Array<{gemName: string, grade: string}>}
 */
export const buildGemstoneParams = () =>
  gemstones.flatMap(({ name, levels, grade }) =>
    levels.map((level) => ({
      gemName: `${level}레벨 ${name}`,
      grade,
    })),
  );

/**
 * API에서 각 보석별 시세를 조회하는 함수
 * @param {Array<{gemName: string, grade: string}>} gemParams
 * @returns {Promise<Array>}
 */
export const fetchGemstonePrices = async (gemParams) =>
  Promise.all(gemParams.map(({ gemName, grade }) => fnFetchEnGemstoneFromApi(gemName, grade)));

/**
 * API 결과에서 이름, 가격만 추출하는 함수
 * @param {Array} gemResults
 * @returns {Array<{name: string, buyPrice: number}>}
 */
export const extractGemItems = (gemResults) =>
  gemResults
    .map((gemItems) => {
      if (Array.isArray(gemItems) && gemItems[0]) {
        return {
          name: gemItems[0].Name,
          buyPrice: gemItems[0].AuctionInfo.BuyPrice,
        };
      }
      return null;
    })
    .filter(Boolean);
