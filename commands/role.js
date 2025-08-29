import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { roleToggle } from "../utils/roleToggle.js";

/**
 * 역할 설정 명령어를 처리하는 함수
 * @param {*} message - 디스코드 메시지 객체
 * @returns {Promise<void>}
 */
export const handleRoleCommand = async (message) => {
  try {
    // 사용자 ID를 기반으로 고유한 채널명 생성 (사용자명 변경 방지)
    const channelName = `알림설정-${message.author.id}`;
    
    // 이미 존재하는 채널인지 확인 (사용자 ID 기반)
    let privateChannel = message.guild.channels.cache.find(
      ch => ch.name === channelName && ch.type === 0 // 0은 텍스트 채널
    );
    
    // 기존 채널이 있지만 권한이 잘못 설정된 경우 재설정
    if (privateChannel) {
      try {
        // 권한 확인 및 재설정
        const permissions = privateChannel.permissionOverwrites.cache;
        const userPermission = permissions.get(message.author.id);
        const botPermission = permissions.get(message.client.user.id);
        
        if (!userPermission || !botPermission) {
          // 권한 재설정
          await privateChannel.permissionOverwrites.set([
            {
              id: message.guild.id, // @everyone
              deny: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
            },
            {
              id: message.author.id, // 명령어 사용자
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
            },
            {
              id: message.client.user.id, // 봇
              allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels']
            }
          ]);
        }
      } catch (permError) {
        console.error('권한 재설정 실패:', permError);
        // 권한 재설정 실패 시 채널 삭제 후 재생성
        await privateChannel.delete();
        privateChannel = null;
      }
    }
    
    if (!privateChannel) {
      // 새 개인 채널 생성
      privateChannel = await message.guild.channels.create({
        name: channelName,
        type: 0, // 텍스트 채널
        parent: message.channel.parent, // 같은 카테고리에 생성
        permissionOverwrites: [
          {
            id: message.guild.id, // @everyone
            deny: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: message.author.id, // 명령어 사용자
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
          },
          {
            id: message.client.user.id, // 봇
            allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageChannels']
          }
        ]
      });
    }
    
    // 개인 채널에 버튼 전송
    const buttons = roleToggle.buildButtons(ActionRowBuilder, ButtonBuilder, ButtonStyle);
    await privateChannel.send({
      content: `🔔 **${message.author.username}님의 골드섬 알림 설정**\n\n아래 버튼을 클릭하여 알림을 켜거나 끄세요:\n\n💡 이 채널은 ${message.author.username}님과 봇만 볼 수 있습니다.`,
      components: [buttons]
    });
    
    // 원래 채널에 확인 메시지 전송 (사용자명으로 표시)
    const displayName = `알림설정-${message.author.username}`;
    await message.reply(`✅ 개인 채널 **#${displayName}**에 알림 설정 메뉴를 보냈습니다!`);
    
  } catch (error) {
    console.error('개인 채널 생성 실패:', error);
    await message.reply('❌ 개인 채널을 생성할 수 없습니다. 봇에게 채널 생성 권한이 있는지 확인해주세요.');
  }
};
