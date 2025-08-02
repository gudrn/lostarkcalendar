import dotenv from 'dotenv';
import { gemstones } from '../constants/data.js';
import { fnFetchEnGemstoneFromApi } from '../apis/auctionApi.js';
dotenv.config();

// 보석(작열/겁화 등) 마켓 데이터를 gemstones 배열의 각 조합별로 외부 API에서 조회하여 이름, 가격만 추출한 배열로 반환
export const getGemstonePrices = async () => {
  const gemParams = gemstones.flatMap(({ name, levels, grade }) =>
    levels.map((level) => ({
      gemName: `${level}레벨 ${name}`,
      grade,
    })),
  );

  const gemResults = await Promise.all(
    gemParams.map(({ gemName, grade }) => fnFetchEnGemstoneFromApi(gemName, grade)),
  );

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
  // 보석 정보를 등급별로 그룹화하여 보기 좋게 출력
  const groupByGrade = arrGemItems.reduce((acc, gem) => {
    // 예: "7레벨 작열의 보석"에서 등급 추출 (전설/유물/고대)
    const gradeMatch = gem.name.match(/(전설|유물|고대)/);
    const grade = gradeMatch ? gradeMatch[1] : '기타';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(gem);
    return acc;
  }, {});

  let messageResult = [];
  for (const grade of Object.keys(groupByGrade)) {
    messageResult.push(`\n[${grade} 보석 시세]`);
    groupByGrade[grade].forEach((gem) => {
      // "7레벨 작열의 보석"에서 "7레벨 작열의 보석"만 남기고 등급은 생략
      const nameWithoutGrade = gem.name.replace(/^(전설|유물|고대)\s*/, '');
      messageResult.push(`- ${nameWithoutGrade}: ${gem.buyPrice.toLocaleString()}골드`);
    });
  }
  messageResult = messageResult.join('\n');
  return messageResult;
};
