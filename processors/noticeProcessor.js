import { getTodayStringKST } from '../utils/timeUtil.js';
import { fetchNoticesApi } from '../apis/noticesApi.js';

/**
 * 오늘 날짜의 "업데이트 내역 안내" 또는 "라이브"가 포함된 공지사항 링크 배열을 반환
 * @returns {Promise<string[]|null>} 링크 배열 또는 null
 */
export const getNoticesFromApi = async () => {
  try {
    const data = await fetchNoticesApi();
    const todayString = getTodayStringKST();

    // 오늘 날짜의 "업데이트 내역 안내" 또는 "라이브"가 포함된 공지만 필터링
    const links = data
      .filter((notice) => {
        if (!notice.Date || !notice.Title) return false;
        const [datePart] = notice.Date.split('T');
        return (
          datePart === todayString &&
          (notice.Title.includes('업데이트 내역 안내') || notice.Title.includes('라이브'))
        );
      })
      .map((notice) => notice.Link);

    return links;
  } catch (error) {
    console.error('공지사항 API 호출 실패:', error);
    return null;
  }
};
