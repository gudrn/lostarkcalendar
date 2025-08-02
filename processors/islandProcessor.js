import { isGoldIsland, getTodayTimes, createGoldIslandMessage } from '../utils/islandUtils.js';

/**
 * 골드섬 데이터를 필터링하고 처리
 * @param {Array} weekdata - 주간 데이터
 * @param {string} todayString - 오늘 날짜 문자열
 * @returns {string|false} - 골드섬 메시지 또는 false
 */
export const processGoldIslands = (weekdata, todayString) => {
  // 골드가 보상에 포함된 모험섬만 필터링
  const goldIslands = weekdata.filter((event) => isGoldIsland(event, todayString));

  // 골드섬이 없으면 false 반환
  if (!goldIslands || goldIslands.length === 0) return false;

  const firstGoldIsland = goldIslands[0];
  const todayTimes = getTodayTimes(firstGoldIsland.StartTimes, todayString);

  // 오늘자에 시작하는 골드섬이 없으면 false 반환
  if (todayTimes.length === 0) return false;

  return createGoldIslandMessage(firstGoldIsland, todayTimes);
};
