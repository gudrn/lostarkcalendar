import dotenv from 'dotenv';
import { getTodayStringKST } from '../utils/timeUtil.js';
import { fetchNoticesApi } from '../model/model.js';
dotenv.config();

// /news/notices 엔드포인트를 호출해서 오늘 날짜의 "업데이트 내역 안내" 공지 링크만 반환하는 함수
export const getNoticesFromApi = async () => {
  try {
    const data = await fetchNoticesApi();
    const todayString = getTodayStringKST();

    // response.data가 배열 형태라고 가정
    // 오늘 날짜의 "업데이트 내역 안내"만 필터링
    const links = data
      .filter((notice) => {
        if (!notice.Date || !notice.Title) return false;
        const [datePart] = notice.Date.split('T');
        return datePart === todayString && notice.Title.includes('업데이트 내역 안내');
      })
      .map((notice) => notice.Link);

    // 링크 배열 반환 (없으면 빈 배열)
    return links;
  } catch (error) {
    console.error('공지사항 API 호출 실패:', error);
    return null;
  }
};
