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

// 보석 아이템 페이지를 가져오는 함수
export const fnFetchEnGemstoneFromApi = async (sName, grade) => {
  try {
    const oResponse = await fetch(`https://developer-lostark.game.onstove.com/auctions/items`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `bearer ${process.env.LOSTARK_API_KEY}`,
      },
      body: JSON.stringify({
        ItemLevelMin: 0,
        ItemLevelMax: 0,
        ItemGradeQuality: null,
        ItemUpgradeLevel: null,
        ItemTradeAllowCount: null,
        Sort: 'BUY_PRICE',
        CategoryCode: 210000,
        ItemTier: 4,
        ItemGrade: `${grade}`,
        ItemName: sName,
        PageNo: 0,
        SortCondition: 'ASC',
      }),
    });
    const oData = await oResponse.json();

    return oData.Items;
  } catch (error) {
    console.error('fnFetchEnGemstoneFromApi 에러:', error);
    return null;
  }
};
