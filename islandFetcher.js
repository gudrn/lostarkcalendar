import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// 오늘의 모든 모험섬 정보를 저장할 전역변수 배열 (외부에서 참조 가능)
export let todayIslandsData = [];

// 오늘 날짜(한국 시간) 문자열 반환 함수
function getTodayStringKST() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('ko-KR', options);
  const parts = formatter.formatToParts(now);

  const year = parts.find((p) => p.type === 'year').value;
  const month = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;
  return `${year}-${month}-${day}`;
}

// 9시, 11시, 13시, 19시, 23시에 해당하는 시간만 필터링
const ALLOWED_HOURS = ['09', '11', '13', '19', '23'];

// 골드 아이템이 있는 모험섬만 추출
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

    // 골드가 보상에 포함된 모험섬만 필터링
    const goldIslands = res.data.filter((event) => {
      if (event.CategoryName !== '모험 섬') return false;
      return event.RewardItems.some((reward) =>
        reward.Items.some((item) => item.Name.includes('골드')),
      );
    });

    // 오늘 날짜 + 허용된 시간대만 필터링
    let ifToday = goldIslands.filter((event) => {
      for (const time of event.StartTimes) {
        const [datePart, timePart] = time.split('T');
        if (datePart === todayString) {
          const hour = timePart.split(':')[0];
          if (ALLOWED_HOURS.includes(hour)) {
            return true;
          }
        }
      }
      return false;
    });

    if (!ifToday || ifToday.length === 0) {
      return null;
    }

    const todayGoldIsland = ifToday.map((event) => {
      return `${event.ContentsName} ${event.StartTimes.join(', ')}`;
    });

    // 메시지 생성
    const message = ifToday
      .map((event) => {
        // 오늘 날짜에 해당하는 StartTimes만 추출 및 정렬
        const todayTimes = event.StartTimes.filter((time) => time.startsWith(todayString)).map(
          (time) => {
            const hour = time.split('T')[1].split(':')[0];
            return `${hour}시`;
          },
        );

        return `${event.ContentsName}: (${todayTimes.join(', ')})`;
      })
      .join('\n');

    todayIslandsData.push(message);
    return message;
  } catch (err) {
    console.error(err);
    return '❌ 모험섬 정보를 불러오지 못했어요.';
  }
};
