import schedule from 'node-schedule';
import { getTodayGoldIslands, setWeekdata } from '../fetchers/islandFetcher.js';
import dotenv from 'dotenv';
import { getNoticesFromApi } from '../services/noticeService.js';
dotenv.config();

/**
 * 골드 모험섬 알림 메시지 전송 함수
 * @param {Client} client - Discord 클라이언트 객체
 */
const sendIslandMessage = async (client) => {
  try {
    // 환경변수에서 채널 ID를 가져와 해당 채널 객체를 fetch
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    // 오늘의 골드 모험섬 메시지 가져오기
    const message = await getTodayGoldIslands();
    if (!message) {
      // 메시지가 없으면 함수 종료
      return;
    }
    // 채널에 메시지 전송
    await channel.send(
      `@everyone\n⏰ 오늘 골드를 주는 모험섬\n${message}\n즐거운 로생되세요.\n ----------------------------------------`,
    );
  } catch (err) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error('❌ 자동 알림 전송 실패:', err);
  }
};

/**
 * 공지사항 알림 메시지 전송 함수
 * @param {Client} client - Discord 클라이언트 객체
 */
const sendNotice = async (client) => {
  try {
    // weekdata를 null로 초기화 (데이터 갱신 목적)
    setWeekdata();
    // 환경변수에서 공지 채널 ID를 가져와 해당 채널 객체를 fetch
    const channel = await client.channels.fetch(process.env.CHANNEL_ID2);
    // 공지사항 메시지 가져오기
    const message = await getNoticesFromApi();
    if (!message) {
      // 메시지가 없으면 함수 종료
      return;
    }
    // 채널에 공지사항 메시지 전송
    await channel.send(`${message}`);
  } catch (err) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error('❌ 자동 알림 전송 실패(공지):', err);
  }
};

/**
 * 스케줄 등록 함수
 * @param {Client} client - Discord 클라이언트 객체
 */
export const scheduleIslandAlerts = (client) => {
  // 매일 12시 30분에 골드 모험섬 알림 전송
  schedule.scheduleJob('30 12 * * *', () => sendIslandMessage(client));
  // 매일 20시 55분에 골드 모험섬 알림 전송
  schedule.scheduleJob('55 20 * * *', () => sendIslandMessage(client));
  // 매주 수요일 10시 5분에 공지사항 알림 전송
  schedule.scheduleJob('2 10 * * 3', () => sendNotice(client));
};
