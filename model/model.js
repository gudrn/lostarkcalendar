import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
// 로스트아크 게임 컨텐츠 캘린더 API에서 데이터를 가져오는 함수
export const fetchLandApi = async () => {
  // axios를 사용하여 GET 요청을 보냄
  const { data } = await axios.get(
    'https://developer-lostark.game.onstove.com/gamecontents/calendar',
    {
      headers: {
        // 환경변수에 저장된 LOSTARK_API_KEY를 사용하여 인증 헤더 추가
        Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
      },
    },
  );
  // 받아온 데이터 반환
  return data;
};

// 로스트아크 공지사항 API에서 데이터를 가져오는 함수
export const fetchNoticesApi = async () => {
  // axios를 사용하여 GET 요청을 보냄
  const { data } = await axios.get('https://developer-lostark.game.onstove.com/news/notices', {
    headers: {
      // 환경변수에 저장된 LOSTARK_API_KEY를 사용하여 인증 헤더 추가
      Authorization: `Bearer ${process.env.LOSTARK_API_KEY}`,
    },
  });
  // 받아온 데이터 반환
  return data;
};
