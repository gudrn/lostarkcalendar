import { apiGet } from '../utils/apiUtils.js';

// 로스트아크 게임 컨텐츠 캘린더 API
export const fetchLandApi = async () => {
  return await apiGet('/gamecontents/calendar');
};
