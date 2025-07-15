const schedule = require("node-schedule");
const { getTodayGoldIslands } = require("./islandFetcher");
require("dotenv").config();

const scheduleIslandAlerts = (client) => {
  const sendIslandMessage = async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      const message = await getTodayGoldIslands();
      if (!message) return;
      await channel.send(
        `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${message} \n까먹지 마시고 4000천골 더 벌어야죠.`
      );
    } catch (err) {
      console.error("자동 알림 전송 실패:", err);
    }
  };

  // 매일 12시 30분에 알림
  schedule.scheduleJob("30 12 * * *", sendIslandMessage);
  // 매일 18시 30분에 알림
  schedule.scheduleJob("30 18 * * *", sendIslandMessage);
};

module.exports = scheduleIslandAlerts;
