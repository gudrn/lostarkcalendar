import { handleIslandCommand } from '../commands/island.js';
import { handleNoticeCommand } from '../commands/notice.js';
import { handleRelicCommand, handleGemstoneCommand } from '../commands/market.js';
import { handleRoleCommand } from '../commands/role.js';
import { Events, MessageFlags } from "discord.js";
import { roleToggle } from "../utils/roleToggle.js";



// 테스트용 명령어 핸들러
async function handleTestCommand(message) {
  await message.channel.send({
    content: `🧪 **테스트 메시지**\n\n현재 설정된 역할 ID: \`${roleToggle.ROLE_ID}\`\n역할 멘션: <@&${roleToggle.ROLE_ID}>\n\n이 메시지로 역할 시스템이 제대로 작동하는지 테스트할 수 있습니다.`
  });
}

// 각 명령어별 핸들러를 객체로 분리하여 유지보수성을 높임
const COMMAND_HANDLERS = {
  '!골드섬': handleIslandCommand,
  '!공지': handleNoticeCommand,
  '!보석': handleGemstoneCommand,
  '!유물': handleRelicCommand,
  '!역할': handleRoleCommand,
  '!테스트': handleTestCommand,
};

export async function handleMessage(message) {
  if (message.author.bot) return;
  
  const handler = COMMAND_HANDLERS[message.content];
  if (handler) {
    try {
      await handler(message);
    } catch (err) {
      await message.channel.send('❌ 명령어 처리 중 오류가 발생했습니다.');
    }
  }
}

// 골드섬 알림 역할 버튼 인터랙션 핸들러
export const handle = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const member = interaction.member;

        if (interaction.customId === "gold_on") {
            try {
                await member.roles.add(roleToggle.ROLE_ID);
                await interaction.reply({
                    content: "✅ 골드섬 알림을 받도록 설정했어요!",
                    flags: MessageFlags.Ephemeral,
                });
            } catch (err) {
                await interaction.reply({
                    content: "❌ 역할 추가 중 오류가 발생했습니다.",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }

        if (interaction.customId === "gold_off") {
            try {
                await member.roles.remove(roleToggle.ROLE_ID);
                await interaction.reply({
                    content: "❌ 골드섬 알림을 받지 않도록 설정했어요!",
                    flags: MessageFlags.Ephemeral,
                });
            } catch (err) {
                await interaction.reply({
                    content: "❌ 역할 제거 중 오류가 발생했습니다.",
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    }
};
