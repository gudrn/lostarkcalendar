import {
  formatGemstonePrices,
  groupGemstonesByGrade,
  buildGemstoneParams,
  fetchGemstonePrices,
  extractGemItems,
} from '../utils/gemstoneUtil.js';
/**
 * 보석 시세를 조회하여 포맷팅된 메시지로 반환하는 함수
 * @returns {Promise<string>} - 포맷팅된 보석 시세 메시지
 */
export const getGemstonePrices = async () => {
  // 1. 조회할 보석 조합 생성
  const gemParams = buildGemstoneParams();

  // 2. API에서 각 보석별 시세 조회
  const gemResults = await fetchGemstonePrices(gemParams);

  // 3. 결과에서 이름, 가격만 추출
  const arrGemItems = extractGemItems(gemResults);

  // 4. 등급별로 그룹화
  const groupByGrade = groupGemstonesByGrade(arrGemItems);

  // 5. 보기 좋은 메시지로 포맷팅
  return formatGemstonePrices(groupByGrade);
};
