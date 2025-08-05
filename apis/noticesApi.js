import { apiGet } from '../utils/apiUtils.js';

// 로스트아크 공지사항 API에서 데이터를 가져오는 함수
export const fetchNoticesApi = async () => {
  return await apiGet('/news/notices');
};
