const axios = require("axios");
const dotenv = require("dotenv");
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

const getTodayGoldIslands = async () => {
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

    // 조건에 맞는 섬만 추출 (골드만)
    const islands = res.data.filter((event) => {
      if (event.CategoryName !== "모험 섬") return false;
      if (!event.StartTimes || !Array.isArray(event.StartTimes)) return false;
      if (!event.RewardItems || !Array.isArray(event.RewardItems)) return false;

      // 오늘 날짜에 해당하는 StartTimes가 있는지 확인
      const hasToday = event.StartTimes.some((startTime) => {
        const eventDate = new Date(
          new Date(startTime).getTime() + 9 * 60 * 60 * 1000
        );
        const eventYear = eventDate.getFullYear();
        const eventMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
        const eventDay = String(eventDate.getDate()).padStart(2, "0");
        const eventDateString = `${eventYear}-${eventMonth}-${eventDay}`;
        // 시간도 필터링
        const hour = String(eventDate.getHours()).padStart(2, "0");
        return eventDateString === todayString && ALLOWED_HOURS.includes(hour);
      });
      if (!hasToday) return false;

      // RewardItems의 Items 배열에 "골드"가 있는지 확인
      for (const reward of event.RewardItems) {
        if (!reward.Items || !Array.isArray(reward.Items)) continue;
        for (const item of reward.Items) {
          if (!item.Name || !item.Name.includes("골드")) continue;

          // StartTimes가 없는 경우(항상 지급되는 경우)도 있으므로, StartTimes가 없으면 오늘 날짜와 무관하게 true 반환
          if (
            !item.StartTimes ||
            !Array.isArray(item.StartTimes) ||
            item.StartTimes.length === 0
          ) {
            return true;
          }

          // StartTimes가 있으면, 오늘 날짜 및 허용된 시간에 해당하는 시간이 있는지 확인
          for (const startTime of item.StartTimes) {
            if (typeof startTime === "string" && startTime.includes("T")) {
              const [datePart, timePart] = startTime.split("T"); // "2025-07-12", "09:00:00"
              if (datePart === todayString) {
                const hour = timePart.split(":")[0];
                if (ALLOWED_HOURS.includes(hour)) {
                  return true;
                }
              }
            }
          }
        }
      }
      return false;
    });

    if (islands.length === 0) {
      return "오늘 골드를 주는 모험섬이 없습니다.";
    }

    // 모험섬 이름이 중복되는 것은 하나로만 표시
    // 각 섬 이름별로 시간, 보상종류를 모아서 출력
    const islandMap = new Map();

    islands.forEach((event) => {
      // 오늘 날짜 및 허용된 시간에 해당하는 StartTimes만 추출
      const todayTimes = event.StartTimes.filter((startTime) => {
        const eventDate = new Date(
          new Date(startTime).getTime() + 9 * 60 * 60 * 1000
        );
        const eventYear = eventDate.getFullYear();
        const eventMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
        const eventDay = String(eventDate.getDate()).padStart(2, "0");
        const eventDateString = `${eventYear}-${eventMonth}-${eventDay}`;
        const hour = String(eventDate.getHours()).padStart(2, "0");
        return eventDateString === todayString && ALLOWED_HOURS.includes(hour);
      });

      // 해당 이벤트에서 골드 보상 종류 추출
      let rewardTypes = new Set();
      for (const reward of event.RewardItems) {
        if (!reward.Items || !Array.isArray(reward.Items)) continue;
        for (const item of reward.Items) {
          if (item.Name && item.Name.includes("골드")) rewardTypes.add("골드");
        }
      }

      // 기존에 이미 있으면 시간과 보상종류를 합침
      if (!islandMap.has(event.ContentsName)) {
        islandMap.set(event.ContentsName, {
          times: [],
          rewardTypes: new Set(),
        });
      }
      const islandInfo = islandMap.get(event.ContentsName);

      todayTimes.forEach((startTime) => {
        const eventDate = new Date(
          new Date(startTime).getTime() + 9 * 60 * 60 * 1000
        );
        const hour = String(eventDate.getHours()).padStart(2, "0");
        const minute = String(eventDate.getMinutes()).padStart(2, "0");
        const timeStr = `${hour}시${
          minute !== "00" ? " " + minute + "분" : ""
        }`;
        if (!islandInfo.times.includes(timeStr)) {
          islandInfo.times.push(timeStr);
        }
      });

      rewardTypes.forEach((type) => islandInfo.rewardTypes.add(type));
    });

    // 결과 문자열 생성
    let result = [];
    islandMap.forEach((info, name) => {
      if (info.times.length === 0) return; // 해당 시간대가 없으면 출력하지 않음
      const timesStr = info.times.join(", ");
      const rewardTypeStr = Array.from(info.rewardTypes).join(", ");
      result.push(`${name} - ${timesStr} (${rewardTypeStr})`);
    });

    // 결과 반환 (여러 줄로)
    if (result.length === 0) {
      return "오늘 골드를 주는 모험섬이 없습니다.";
    }
    return result.join("\n");
  } catch (err) {
    console.error(err);
    return "❌ 모험섬 정보를 불러오지 못했어요.";
  }
};

module.exports = { getTodayGoldIslands };
