import { apiPost } from '../util/apiUtils.js';
// 보석 아이템 페이지를 가져오는 함수
export const fnFetchEnGemstoneFromApi = async (sName, grade) => {
  const body = {
    ItemLevelMin: 0,
    ItemLevelMax: 0,
    ItemGradeQuality: null,
    ItemUpgradeLevel: null,
    ItemTradeAllowCount: null,
    Sort: 'BUY_PRICE',
    CategoryCode: 210000,
    ItemTier: 4,
    ItemGrade: `${grade}`,
    ItemName: sName,
    PageNo: 0,
    SortCondition: 'ASC',
  };
  const oData = await apiPost('/auctions/items', body);
  return oData && oData.Items ? oData.Items : null;
};
