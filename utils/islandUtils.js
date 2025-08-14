// 골드섬 알림을 보낼 시간대
export const ALLOWED_HOURS = ['09', '11', '13', '19', '21', '23'];

/**
 * 골드 아이템이 포함된 모험섬인지 확인
 * @param {Object} event - 모험섬 이벤트 객체
 * @param {string} todayString - 오늘 날짜 문자열
 * @returns {boolean} - 골드섬 여부
 */
export const isGoldIsland = (event, todayString) => {
  if (event.CategoryName !== '모험 섬') return false;

  return event.RewardItems.some((reward) =>
    reward.Items.some((item) => {
      const isGold = item.Name.includes('골드');
      const hasStartTimes = Array.isArray(item.StartTimes);
      if (!isGold || !hasStartTimes) return false;

      // StartTimes 중 오늘 날짜로 시작하는 항목이 있는지 확인
      return item.StartTimes.some((goldTime) => goldTime.startsWith(todayString));
    }),
  );
};

/**
 * 오늘 시간대에 해당하는 시간만 추출
 * @param {Array} startTimes - 시작 시간 배열
 * @param {string} todayString - 오늘 날짜 문자열
 * @returns {Array} - 오늘 시간대 배열
 */
export const getTodayTimes = (startTimes, todayString) => {
  const todayTimes = [];

  for (const time of startTimes) {
    const [day, hourStr] = time.split('T');
    if (day === todayString) {
      const [hour] = hourStr.split(':');
      if (ALLOWED_HOURS.includes(hour)) {
        todayTimes.push(hour);
      }
    }
  }

  return todayTimes;
};

/**
 * 골드섬 메시지 생성
 * @param {Object} island - 모험섬 객체
 * @param {Array} todayTimes - 오늘 시간대 배열
 * @returns {string} - 포맷된 메시지
 */
export const createGoldIslandMessage = (island, todayTimes) => {
  const timeString = todayTimes.map((t) => `${t}시`).join(', ');
  return `${island.ContentsName}: (${timeString})`;
};

/**
 * 오늘 날짜의 "업데이트 내역 안내" 또는 "라이브"가 포함된 공지만 필터링하여 링크 배열로 반환하는 함수
 * @param {Array} data - 공지사항 데이터 배열
 * @param {string} todayString - 오늘 날짜 문자열
 * @returns {string[]} 링크 배열
 */
export const extractTodayUpdateNoticeLinks = (data, todayString) => {
  return data
    .filter((notice) => {
      if (!notice.Date || !notice.Title) return false;
      const [datePart] = notice.Date.split('T');
      return (
        datePart === todayString &&
        (notice.Title.includes('업데이트 내역 안내') || notice.Title.includes('라이브'))
      );
    })
    .map((notice) => notice.Link);
};
