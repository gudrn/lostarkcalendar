import axios from 'axios';
import { LOSTARK_API_BASE, getAuthHeader } from '../config/apiConfig.js';

// 공통 에러 핸들러
export const handleApiError = (fnName, error) => {
  console.error(`${fnName} 에러:`, error);
  return null;
};

// 공통 GET 요청 함수
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

// 공통 POST 요청 함수 (에러 핸들링 및 응답 상태 체크 강화)
export const apiPost = async (endpoint, body) => {
  try {
    const { data } = await axios.post(
      `${LOSTARK_API_BASE}${endpoint}`,
      body,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      },
    );
    return data;
  } catch (error) {
    return handleApiError('apiPost', error);
  }
};
