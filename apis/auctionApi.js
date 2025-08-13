import { apiPost } from '../utils/apiUtils.js';

/**
 * 영웅/유물/고대 보석을 경매장에서 조회하는 함수
 * @param {string} sName - 보석 이름
 * @param {string} grade - 등급
 * @returns {Promise<Array|null>} - 아이템 배열 또는 null
 */
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

/**
 * 유물 각인서 페이지를 경매장에서 조회하는 함수
 * @param {number} nPage - 페이지 번호
 * @returns {Promise<Array>} - 아이템 배열
 */
export const fnFetchRelicFromApi = async (nPage) => {
  const body = {
    Sort: 'CURRENT_MIN_PRICE',
    CategoryCode: 40000,
    ItemGrade: '유물',
    PageNo: nPage,
    SortCondition: 'DESC',
  };
  const oData = await apiPost('/markets/items', body);
  return oData.Items;
};
