/**
 * 오늘 날짜를 KST(한국 표준시) 기준으로 'YYYY-MM-DD' 형식의 문자열로 반환합니다.
 * @returns {string} - 오늘 날짜 문자열 (예: '2024-06-13')
 */
export function getTodayStringKST() {
  const now = new Date();
  const options = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  const formatter = new Intl.DateTimeFormat('ko-KR', options);
  const parts = formatter.formatToParts(now);

  const year = parts.find((p) => p.type === 'year').value;
  const month = parts.find((p) => p.type === 'month').value;
  const day = parts.find((p) => p.type === 'day').value;
  return `${year}-${month}-${day}`;
}
