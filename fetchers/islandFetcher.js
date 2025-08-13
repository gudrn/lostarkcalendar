import { getTodayStringKST } from '../utils/timeUtil.js';
import { fetchLandApi } from '../apis/gameContentApi.js';
import { processGoldIslands } from '../processors/islandProcessor.js';

// 오늘의 모든 모험섬 정보를 저장할 전역 변수 (외부에서 참조 가능)
export let todayIslandsData = [];
let weekdata = null;

/**
 * 오늘 골드를 주는 모험섬 정보를 반환하는 함수
 * @param {string|null} cli - 명령어 문자열 (예: '!골드섬'), 기본값 null
 * @returns {string|false|null} - 오늘 골드섬 정보 메시지, false, 또는 null
 */
export const getTodayGoldIslands = async (cli = null) => {
  try {
    const todayString = getTodayStringKST();

    // 명령어로 호출 시 todayIslandsData에 데이터가 있으면 첫 번째 메시지 반환
    if (cli === '!골드섬' && todayIslandsData.length > 0) {
      return todayIslandsData[0];
    }

    // 명령어가 아니고 todayIslandsData에 데이터가 있으면 마지막 메시지 반환(스케줄러용)
    if (todayIslandsData.length > 0) {
      return todayIslandsData.pop();
    }

    // weekdata가 없으면 가져오기
    if (!weekdata) {
      await getWeekdata();
    }

    return processGoldIslands(weekdata, todayString);
  } catch (err) {
    console.error('❌ 모험섬 정보 조회 중 오류:', err);
    return '❌ 모험섬 정보를 불러오지 못했어요.';
  }
};

/**
 * weekdata를 불러오는 함수 (캐싱)
 * @returns {Promise<Array>} - 주간 데이터
 */
export const getWeekdata = async () => {
  if (!weekdata) {
    weekdata = await fetchLandApi();
  }
  return weekdata;
};

/**
 * weekdata를 초기화하는 함수
 */
export const setWeekdata = () => {
  if (weekdata !== null) weekdata = null;
};
