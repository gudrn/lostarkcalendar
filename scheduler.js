import schedule from "node-schedule";
import { getTodayGoldIslands } from "./islandFetcher.js";
import dotenv from "dotenv";
dotenv.config();

export const scheduleIslandAlerts = (client) => {
  const sendIslandMessage = async () => {
    try {
      const channel = await client.channels.fetch(process.env.CHANNEL_ID);
      const message = await getTodayGoldIslands();
      if (!message) {
        await channel.send(`오늘은 골드섬이 없습니다.`);
        await channel.send(`오늘도 즐거운 로생되세요.`);
        await channel.send(`----------------------------------------`);
        return;
      }
      await channel.send(`@everyone\n⏰ 오늘 골드를 주는 모험섬\n${message} `);
      await channel.send(`오늘도 즐거운 로생되세요.`);
      await channel.send(`----------------------------------------`);
    } catch (err) {
      console.error("❌ 자동 알림 전송 실패:", err);
    }
  };

  // 매일 12시 30분에 알림
  schedule.scheduleJob("30 12 * * *", sendIslandMessage);
  // 매일 18시 30분에 알림
  schedule.scheduleJob("30 18 * * *", sendIslandMessage);
};
