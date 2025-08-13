import { getNoticesFromApi } from '../services/noticeService.js';

/**
 * 공지사항 명령어 핸들러
 * @param {*} message - 디스코드 메시지 객체
 * @returns {Promise<void>}
 */
export const handleNoticeCommand = async (message) => {
  const reply = await getNoticesFromApi();
  if (!reply || !Array.isArray(reply) || reply.length === 0) return;

  // 공지 링크가 여러 개일 경우 하나씩 따로 전송
  for (const link of reply) {
    await message.channel.send(`${link}`);
  }
};
