import dotenv from 'dotenv';
import { gemstones } from '../constants/data.js';
import { fnFetchEnGemstoneFromApi } from '../model/model.js';
dotenv.config();

// 보석(작열/겁화 등) 마켓 데이터를 gemstones 배열의 각 조합별로 외부 API에서 조회하여 이름, 가격만 추출한 배열로 반환
export const arrMarketGemItemFromApi = async () => {
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
  const messageResult = arrGemItems.map((gem) => `${gem.name}: ${gem.buyPrice}골드\n`);

  return messageResult;
};
