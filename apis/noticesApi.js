import { apiGet } from '../utils/apiUtils.js';

/**
 * 공지사항 목록을 가져오는 함수
 * @returns {Promise<Object>} 공지사항 데이터 객체
 */
export const fetchNoticesApi = async () => {
  return await apiGet('/news/notices');
};
