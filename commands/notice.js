import { getNoticesFromApi } from '../services/noticeService.js';

export const handleNoticeCommand = async (message) => {
  const reply = await getNoticesFromApi();
  if (!reply || !Array.isArray(reply) || reply.length === 0) {
    return;
  }
  // 공지 링크가 여러 개일 경우 하나씩 따로 전송
  for (const link of reply) {
    await message.channel.send(`${link}`);
  }
};
