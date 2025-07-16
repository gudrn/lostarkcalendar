import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import { scheduleIslandAlerts } from "./scheduler.js";
import { getTodayGoldIslands } from "./islandFetcher.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", async () => {
  console.log(`✅ 로그인됨: ${client.user.tag}`);

  // 🔔 정식 자동 스케줄 등록
  scheduleIslandAlerts(client);

  // 🕒 현재 한국 시간 출력
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  console.log(
    `🕒 현재 한국 시간: ${koreaTime
      .toISOString()
      .replace("T", " ")
      .slice(0, 19)}`
  );
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!모험섬") {
    const reply = await getTodayGoldIslands();
    if (!reply) {
      message.channel.send(`오늘은 없습니다.`);
      return;
    }

    message.channel.send(reply);
  }
});

client.login(process.env.DISCORD_TOKEN);
