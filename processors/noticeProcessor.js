import { getTodayStringKST } from '../utils/timeUtil.js';
import { fetchNoticesApi } from '../apis/noticesApi.js';
import { extractTodayUpdateNoticeLinks } from '../utils/islandUtils.js';

/**
 * 오늘 날짜의 "업데이트 내역 안내" 또는 "라이브"가 포함된 공지사항 링크 배열을 반환
 * @returns {Promise<string[]|null>} 링크 배열 또는 null
 */
export const getNoticesFromApi = async () => {
  try {
    const data = await fetchNoticesApi();
    const todayString = getTodayStringKST();

    // 별도 함수로 분리된 링크 추출
    const links = extractTodayUpdateNoticeLinks(data, todayString);

    return links;
  } catch (error) {
    console.error('공지사항 API 호출 실패:', error);
    return null;
  }
};
