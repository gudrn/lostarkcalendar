import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ALLOWED_HOURS = ["09", "11", "13", "19", "23"];

// 오늘 날짜(한국 시간) yyyy-mm-dd 문자열 반환
function getTodayStringKst() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return koreaTime.toISOString().slice(0, 10);
}

// 날짜와 시간 필터링 함수
function isTodayAllowedTime(dateStr, todayString) {
  const date = new Date(new Date(dateStr).getTime() + 9 * 60 * 60 * 1000);
  const dateString = date.toISOString().slice(0, 10);
  const hour = String(date.getHours()).padStart(2, "0");
  return dateString === todayString && ALLOWED_HOURS.includes(hour);
}

// 골드 보상 여부 확인
function hasGoldReward(event, todayString) {
  if (!event.RewardItems || !Array.isArray(event.RewardItems)) return false;
  for (const reward of event.RewardItems) {
    if (!reward.Items || !Array.isArray(reward.Items)) continue;
    for (const item of reward.Items) {
      if (!item.Name || !item.Name.includes("골드")) continue;
      // StartTimes가 없으면 무조건 골드
      if (
        !item.StartTimes ||
        !Array.isArray(item.StartTimes) ||
        item.StartTimes.length === 0
      ) {
        return true;
      }
      // StartTimes가 있으면 오늘 허용된 시간에 골드 지급인지 확인
      for (const startTime of item.StartTimes) {
        if (typeof startTime === "string" && startTime.includes("T")) {
          const [datePart, timePart] = startTime.split("T");
          const hour = timePart.split(":")[0];
          if (datePart === todayString && ALLOWED_HOURS.includes(hour)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// 오늘 골드 주는 모험섬 정보 반환
export const getTodayIsGoldLands = async () => {
  try {
    const res = await axios.get(
      "https://developer-lostark.game.onstove.com/gamecontents/calendar",
      {
        headers: {
          Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
        },
      }
    );

    const todayString = getTodayStringKst();

    // 조건에 맞는 섬만 추출
    const islands = res.data.filter((event) => {
      if (event.CategoryName !== "모험 섬") return false;
      if (!event.StartTimes || !Array.isArray(event.StartTimes)) return false;
      // 오늘 날짜 + 허용 시간에 해당하는 StartTimes가 있는지
      const hasToday = event.StartTimes.some((startTime) =>
        isTodayAllowedTime(startTime, todayString)
      );
      if (!hasToday) return false;
      // 골드 보상 여부
      return hasGoldReward(event, todayString); // 골드 보상 여부 확인
    });

    if (islands.length === 0) {
      return "오늘 골드를 주는 모험섬이 없습니다.";
    }

    // 섬별로 시간, 보상종류 정리
    const islandMap = new Map();

    islands.forEach((event) => {
      // 오늘 날짜 + 허용 시간만 추출
      const todayTimes = event.StartTimes.filter((startTime) =>
        isTodayAllowedTime(startTime, todayString)
      );

      // 골드 보상 종류 추출
      const rewardTypes = new Set();
      if (event.RewardItems && Array.isArray(event.RewardItems)) {
        for (const reward of event.RewardItems) {
          if (!reward.Items || !Array.isArray(reward.Items)) continue;
          for (const item of reward.Items) {
            if (item.Name && item.Name.includes("골드"))
              rewardTypes.add("골드");
          }
        }
      }

      if (!islandMap.has(event.ContentsName)) {
        islandMap.set(event.ContentsName, {
          times: [],
          rewardTypes: new Set(),
        });
      }
      const islandInfo = islandMap.get(event.ContentsName);

      todayTimes.forEach((startTime) => {
        const date = new Date(
          new Date(startTime).getTime() + 9 * 60 * 60 * 1000
        );
        const hour = String(date.getHours()).padStart(2, "0");
        const minute = String(date.getMinutes()).padStart(2, "0");
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
    const result = [];
    islandMap.forEach((info, name) => {
      if (info.times.length === 0) return;
      const timesStr = info.times.join(", ");
      const rewardTypeStr = Array.from(info.rewardTypes).join(", ");
      result.push(`${name} - ${timesStr} (${rewardTypeStr})`);
    });

    if (result.length === 0) return null;
    return result.join("\n");
  } catch (err) {
    console.error(err);
    return "❌ 모험섬 정보를 불러오지 못했어요.";
  }
};
