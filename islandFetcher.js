import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// 오늘 날짜(한국 시간) 문자열 반환 함수
function getTodayStringKST() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = koreaTime.getFullYear();
  const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreaTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 9시, 11시, 13시, 19시, 23시에 해당하는 시간만 필터링
const ALLOWED_HOURS = ["09", "11", "13", "19", "23"];

// 골드 아이템이 있는 모험섬만 추출
export const getTodayGoldIslands = async () => {
  try {
    const res = await axios.get(
      "https://developer-lostark.game.onstove.com/gamecontents/calendar",
      {
        headers: {
          Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
        },
      }
    );

    const todayString = getTodayStringKST();
    console.log(todayString);
    const goldIslands = res.data.filter((event) => {
      if (event.CategoryName !== "모험 섬") return false;
      return event.RewardItems.some((reward) =>
        reward.Items.some((item) => item.Name.includes("골드"))
      );
    });
    console.log(goldIslands);

    let ifToday = goldIslands.filter((event) => {
      for (const time of event.StartTimes) {
        const [datePart, timePart] = time.split("T");
        if (datePart === todayString) {
          const hour = timePart.split(":")[0];
          if (ALLOWED_HOURS.includes(hour)) {
            return true;
          }
        }
      }
      return false;
    });
    console.log(ifToday);
    if (ifToday == null) {
      return null;
    }
    const todayGoldIsland = ifToday.map((event) => {
      return `${event.ContentsName} ${event.StartTimes.join(", ")}`;
    });

    const message = ifToday
      .map((event) => {
        // 오늘 날짜에 해당하는 StartTimes만 추출
        const todayTimes = event.StartTimes.filter((time) =>
          time.startsWith(todayString)
        ).map((time) => {
          const hour = time.split("T")[1].split(":")[0];
          return `${hour}시`;
        });
        return `${event.ContentsName}: (${todayTimes.join(", ")})`;
      })
      .join("\n");
    return message;
  } catch (err) {
    console.error(err);
    return "❌ 모험섬 정보를 불러오지 못했어요.";
  }
};
