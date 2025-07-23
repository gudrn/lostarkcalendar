import axios from 'axios';
import dotenv from 'dotenv';
import { getTodayStringKST } from '../util/timeUtil.js';
dotenv.config();

// 오늘의 모든 모험섬 정보를 저장할 전역변수 배열 (외부에서 참조 가능)
export let todayIslandsData = [];

// 9시, 11시, 13시, 19시, 23시에 해당하는 시간만 필터링
const ALLOWED_HOURS = ['09', '11', '13', '19', '23'];

// 골드 아이템이 있는 모험섬만 추출 (골드 주는 날짜도 고려)
export const getTodayGoldIslands = async (cli = null) => {
  try {
    const todayString = getTodayStringKST();
    if (cli === '!골드섬' && todayIslandsData.length !== 0) {
      const message = todayIslandsData[0];
      return message;
    } else if (todayIslandsData.length !== 0) {
      const message = todayIslandsData.pop();
      return message;
    }

    // API 호출
    const res = await axios.get(
      'https://developer-lostark.game.onstove.com/gamecontents/calendar',
      {
        headers: {
          Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
        },
      },
    );

    // 골드가 보상에 포함된 모험섬만 필터링 (골드 지급 날짜도 체크)
    const goldIslands = res.data.filter((event) => {
      if (event.CategoryName !== '모험 섬') return false;
      // 골드 아이템이 있는지, 그리고 그 골드 아이템의 StartTimes에 오늘 날짜가 있는지 확인
      return event.RewardItems.some((reward) =>
        reward.Items.some((item) => {
          if (item.Name.includes('골드') && Array.isArray(item.StartTimes)) {
            // 골드 지급 날짜가 오늘인지 확인
            return item.StartTimes.some((goldTime) => goldTime.startsWith(todayString));
          }
          return false;
        }),
      );
    });

    // 오늘 날짜 + 허용된 시간대 + 골드 지급 시간만 필터링
    let ifToday = goldIslands
      .map((event) => {
        // 골드 아이템의 StartTimes 중 오늘 날짜이면서 허용된 시간대만 추출
        let goldTimes = [];
        event.RewardItems.forEach((reward) => {
          reward.Items.forEach((item) => {
            if (item.Name.includes('골드') && Array.isArray(item.StartTimes)) {
              item.StartTimes.forEach((goldTime) => {
                const [datePart, timePart] = goldTime.split('T');
                if (datePart === todayString) {
                  const hour = timePart.split(':')[0];
                  if (ALLOWED_HOURS.includes(hour)) {
                    goldTimes.push(`${hour}시`);
                  }
                }
              });
            }
          });
        });
        if (goldTimes.length > 0) {
          return {
            ContentsName: event.ContentsName,
            goldTimes: goldTimes.sort((a, b) => a.localeCompare(b)),
          };
        }
        return null;
      })
      .filter((event) => event !== null);

    if (!ifToday || ifToday.length === 0) {
      return null;
    }

    // 메시지 생성
    const message = ifToday
      .map((event) => {
        return `${event.ContentsName}: (${event.goldTimes.join(', ')})`;
      })
      .join('\n');

    todayIslandsData.push(message);
    return message;
  } catch (err) {
    console.error(err);
    return '❌ 모험섬 정보를 불러오지 못했어요.';
  }
};
