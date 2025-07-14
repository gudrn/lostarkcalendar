const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const getIslands = async () => {
  try {
    const res = await axios.get(
      "https://developer-lostark.game.onstove.com/gamecontents/calendar",
      {
        headers: {
          Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
        },
      }
    );

    // 현재 날짜 (한국 시간 기준) 구하기
    const now = new Date();
    const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const year = koreaTime.getFullYear();
    const month = String(koreaTime.getMonth() + 1).padStart(2, "0");
    const day = String(koreaTime.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    // 오늘 날짜의 "모험 섬" 중 골드를 주는 섬만 필터링
    const data = res.data.filter((event) => {
      if (event.CategoryName !== "모험 섬") return false;
      if (!event.StartTime) return false;
      // 이벤트 시작 시간이 오늘인지 확인
      const eventDate = new Date(
        new Date(event.StartTime).getTime() + 9 * 60 * 60 * 1000
      );
      const eventYear = eventDate.getFullYear();
      const eventMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
      const eventDay = String(eventDate.getDate()).padStart(2, "0");
      const eventDateString = `${eventYear}-${eventMonth}-${eventDay}`;
      if (eventDateString !== todayString) return false;

      if (!event.RewardItems || !Array.isArray(event.RewardItems)) return false;

      // RewardItems의 각 아이템의 Items 배열에 "골드"가 있는지 확인
      for (const reward of event.RewardItems) {
        if (!reward.Items || !Array.isArray(reward.Items)) continue;
        for (const item of reward.Items) {
          if (item.Name && item.Name.includes("골드")) {
            return true;
          }
        }
      }
      return false;
    });

    if (data.length === 0) return `오늘 골드를 주는 모험섬이 없습니다.`;

    // 출력: "골드섬, [섬이름] - [몇시]"
    const islandInfos = data.map((event) => {
      // 한국 시간 기준으로 시간 추출
      const eventDate = new Date(
        new Date(event.StartTime).getTime() + 9 * 60 * 60 * 1000
      );
      const hour = String(eventDate.getHours()).padStart(2, "0");
      const minute = String(eventDate.getMinutes()).padStart(2, "0");
      return `골드섬, ${event.ContentsName} - ${hour}시${
        minute !== "00" ? " " + minute + "분" : ""
      }`;
    });

    return islandInfos.join("\n");
  } catch (err) {
    console.error(err);
    return "❌ 모험섬 정보를 불러오지 못했어요.";
  }
};

module.exports = getIslands;
