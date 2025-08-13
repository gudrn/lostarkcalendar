import { apiGet } from '../utils/apiUtils.js';

/**
 * 오늘의 모험섬(골드섬 포함) 정보를 가져오는 함수
 * @returns {Promise<Object>} 모험섬 정보 객체
 */
export const fetchLandApi = async () => {
  return await apiGet('/gamecontents/calendar');
};
