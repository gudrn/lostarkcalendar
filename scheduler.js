const schedule = require("node-schedule");
const getTodayGoldIslands = require("./islandFetcher");
require("dotenv").config();

const scheduleIslandAlerts = (client) => {
  const sendIslandMessage = async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      const message = await getTodayGoldIslands();
      await channel.send(`@everyone\n⏰ 오늘 골드를 주는 모험섬\n${message}`);
    } catch (err) {
      console.error("자동 알림 전송 실패:", err);
    }
  };

  // 매일 12시 6분에 알림
  schedule.scheduleJob("6 12 * * *", sendIslandMessage);
};

module.exports = scheduleIslandAlerts;
