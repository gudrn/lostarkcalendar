require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const getIslands = require("./getIslands");
const scheduleIslandAlerts = require("./scheduler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ 로그인됨: ${client.user.tag}`);
  scheduleIslandAlerts(client); // 🔔 자동 알림 시작
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!모험섬") {
    const reply = await getIslands();
    message.channel.send(reply);
  }
});

client.login(process.env.DISCORD_TOKEN);
