const schedule = require("node-schedule");
const getIslands = require("./islandFetcher");
require("dotenv").config();

const scheduleIslandAlerts = (client) => {
  const sendIslandMessage = async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      const message = await getIslands();
      await channel.send(`@everyone\n⏰ 자동 알림\n${message}`);
    } catch (err) {
      console.error("자동 알림 전송 실패:", err);
    }
  };

  // 매일 오전 9시
  schedule.scheduleJob("0 12 * * *", sendIslandMessage);

  // 매일 오후 6시
  schedule.scheduleJob("0 18 * * *", sendIslandMessage);
};

module.exports = scheduleIslandAlerts;
