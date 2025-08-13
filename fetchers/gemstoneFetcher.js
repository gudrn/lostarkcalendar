import dotenv from 'dotenv';
import { gemstones } from '../constants/gemstones.js';
import { fnFetchEnGemstoneFromApi } from '../apis/auctionApi.js';
import { formatGemstonePrices, groupGemstonesByGrade } from '../utils/gemstoneUtil.js';
dotenv.config();

/**
 * 보석(작열/겁화 등) 마켓 데이터를 gemstones 배열의 각 조합별로 외부 API에서 조회하여
 * 이름, 가격만 추출한 배열로 반환
 */
export const getGemstonePrices = async () => {
  // 1. 조회할 보석 조합 생성
  const gemParams = gemstones.flatMap(({ name, levels, grade }) =>
    levels.map((level) => ({
      gemName: `${level}레벨 ${name}`,
      grade,
    })),
  );

  // 2. API에서 각 보석별 시세 조회
  const gemResults = await Promise.all(
    gemParams.map(({ gemName, grade }) => fnFetchEnGemstoneFromApi(gemName, grade)),
  );

  // 3. 결과에서 이름, 가격만 추출
  const arrGemItems = gemResults
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

  // 4. 등급별로 그룹화 (별도 유틸 함수로 분리)
  const groupByGrade = groupGemstonesByGrade(arrGemItems);

  // 5. 보기 좋은 메시지로 포맷팅 (별도 유틸 함수로 분리)
  return formatGemstonePrices(groupByGrade);
};
