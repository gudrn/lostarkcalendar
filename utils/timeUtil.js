// 오늘 날짜(한국 시간) 문자열 반환 함수
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
