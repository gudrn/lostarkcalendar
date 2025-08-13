import axios from 'axios';
import { LOSTARK_API_BASE, getAuthHeader } from '../config/config.js';

/**
 * API 에러를 처리하는 함수
 * @param {string} fnName - 함수명
 * @param {Error} error - 에러 객체
 * @returns {null}
 */
export const handleApiError = (fnName, error) => {
  console.error(`${fnName} 에러:`, error);
  return null;
};

/**
 * GET 방식으로 API를 호출하는 함수
 * @param {string} endpoint - API 엔드포인트
 * @returns {Promise<any|null>} - 응답 데이터 또는 null
 */
export const apiGet = async (endpoint) => {
  try {
    const { data } = await axios.get(`${LOSTARK_API_BASE}${endpoint}`, {
      headers: getAuthHeader(),
    });
    return data;
  } catch (error) {
    return handleApiError('apiGet', error);
  }
};

/**
 * POST 방식으로 API를 호출하는 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} body - 요청 바디
 * @returns {Promise<any|null>} - 응답 데이터 또는 null
 */
export const apiPost = async (endpoint, body) => {
  try {
    const { data } = await axios.post(`${LOSTARK_API_BASE}${endpoint}`, body, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return data;
  } catch (error) {
    return handleApiError('apiPost', error);
  }
};
