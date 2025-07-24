import dotenv from 'dotenv';
import { getTodayStringKST } from '../util/timeUtil.js';
dotenv.config();

// 오늘의 모든 모험섬 정보를 저장할 전역변수 배열 (외부에서 참조 가능)
export let todayIslandsData = [];
export let weekdata = null;

// 9시, 11시, 13시, 19시, 23시에 해당하는 시간만 필터링
const ALLOWED_HOURS = ['09', '11', '13', '19', '23'];

/**
 * 오늘 골드를 주는 모험섬 정보를 반환하는 함수
 * @param {string|null} cli - 명령어 문자열 (예: '!골드섬'), 기본값 null
 * @returns {string|null} - 오늘 골드섬 정보 메시지 또는 null
 */
export const getTodayGoldIslands = async (cli = null) => {
  try {
    const todayString = getTodayStringKST();

    // '!골드섬' 명령어로 호출되고, todayIslandsData에 데이터가 있으면 첫 번째 메시지 반환
    if (cli === '!골드섬' && todayIslandsData.length !== 0) {
      const message = todayIslandsData[0];
      return message;
      // 명령어가 아니고, todayIslandsData에 데이터가 있으면 마지막 메시지 반환(스케줄러용)
    } else if (todayIslandsData.length !== 0) {
      const message = todayIslandsData.pop();
      return message;
    }

    // weekdata에서 골드가 보상에 포함된 모험섬만 필터링 (골드 지급 날짜도 체크)
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

    // 오늘 날짜 + 허용된 시간대 + 골드 지급 시간만 필터링
    let ifToday = goldIslands
      .map((event) => {
        // 골드 지급 시간이 오늘이고, 허용된 시간대에 해당하는 시간만 추출
        const goldTimes = [];

        event.RewardItems.forEach((reward) => {
          reward.Items.forEach((item) => {
            // 아이템 이름에 '골드'가 없거나 StartTimes가 배열이 아니면 패스
            if (!item.Name.includes('골드') || !Array.isArray(item.StartTimes)) return;

            item.StartTimes.forEach((goldTime) => {
              // goldTime에서 날짜와 시간 분리
              const [datePart, timePart] = goldTime.split('T');
              // 오늘 날짜가 아니면 패스
              if (datePart !== todayString) return;

              // 시간 추출 (시 단위)
              const hour = timePart.split(':')[0];
              // 허용된 시간대에 포함되면 goldTimes에 추가
              if (ALLOWED_HOURS.includes(hour)) {
                goldTimes.push(`${hour}시`);
              }
            });
          });
        });

        // 골드 지급 시간이 없으면 null 반환(필터링됨)
        if (goldTimes.length === 0) return null;

        // 해당 모험섬의 이름과 골드 지급 시간 목록 반환
        return {
          ContentsName: event.ContentsName,
          goldTimes: goldTimes.sort((a, b) => a.localeCompare(b)),
        };
      })
      .filter(Boolean); // null 값 제거

    // 오늘 골드섬이 없으면 null 반환
    if (!ifToday || ifToday.length === 0) {
      return null;
    }

    // 메시지 생성: "섬이름: (시간, 시간, ...)" 형태로 줄바꿈하여 반환
    const message = ifToday
      .map((event) => {
        return `${event.ContentsName}: (${event.goldTimes.join(', ')})`;
      })
      .join('\n');

    // todayIslandsData에 메시지 저장(중복 호출 방지 및 캐싱)
    todayIslandsData.push(message);
    return message;
  } catch (err) {
    // 에러 발생 시 콘솔에 에러 출력 및 안내 메시지 반환
    console.error(err);
    return '❌ 모험섬 정보를 불러오지 못했어요.';
  }
};
