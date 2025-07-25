import dotenv from 'dotenv';
import { getTodayStringKST } from '../util/timeUtil.js';
import { fetchLandApi } from '../model/model.js';
dotenv.config();

// 오늘의 모든 모험섬 정보를 저장할 전역 변수 (외부에서 참조 가능)
export let todayIslandsData = [];
export let weekdata = null;

// 골드섬 알림을 보낼 시간대
const ALLOWED_HOURS = ['09', '11', '13', '19', '23'];

/**
 * 오늘 골드를 주는 모험섬 정보를 반환하는 함수
 * @param {string|null} cli - 명령어 문자열 (예: '!골드섬'), 기본값 null
 * @returns {string|null} - 오늘 골드섬 정보 메시지 또는 null
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

    // weekdata에서 골드가 보상에 포함된 모험섬만 필터링
    const goldIslands = weekdata.filter((event) => {
      // 카테고리가 '모험 섬'이 아니면 제외
      if (event.CategoryName !== '모험 섬') return false;

      // 보상 아이템 중 골드가 포함되어 있고, 오늘 날짜에 지급되는지 확인
      return event.RewardItems.some((reward) =>
        reward.Items.some((item) => {
          const isGold = item.Name.includes('골드');
          const hasStartTimes = Array.isArray(item.StartTimes);
          if (!isGold || !hasStartTimes) return false;

          // StartTimes 중 오늘 날짜로 시작하는 항목이 있는지 확인
          return item.StartTimes.some((goldTime) => goldTime.startsWith(todayString));
        }),
      );
    });

    // 골드섬이 없으면 false 반환
    if (!goldIslands || goldIslands.length === 0) return false;

    // goldIslands[0]의 StartTimes에서 오늘 날짜에 해당하는 시간만 todayTime 배열에 저장
    const todayTime = [];
    for (const time of goldIslands[0].StartTimes) {
      const [day, hourStr] = time.split('T');
      if (day === todayString) {
        const [hour] = hourStr.split(':');
        if (ALLOWED_HOURS.includes(hour)) {
          todayTime.push(`${hour}`);
        }
      }
    }

    // 오늘자에 시작하는 골드섬이 없으면 false 반환
    if (todayTime.length === 0) return false;

    // 메시지 생성
    return `${goldIslands[0].ContentsName}: (${todayTime.map((t) => `${t}시`).join(', ')})`;
  } catch (err) {
    // 에러 발생 시 콘솔에 에러 출력 및 안내 메시지 반환
    console.error(err);
    return '❌ 모험섬 정보를 불러오지 못했어요.';
  }
};

/**
 * weekdata를 불러오는 함수 (캐싱)
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
