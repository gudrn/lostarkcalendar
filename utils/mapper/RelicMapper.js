/**
 * 경매장 아이템 객체를 내부 포맷으로 매핑하는 함수
 * @param {Object} item - 원본 아이템 객체
 * @returns {Object} 매핑된 아이템 객체
 */
export const fnMapMarketItem = (item) => ({
  itemName: item.Name,
  itemCurrentMinPrice: item.CurrentMinPrice,
});
