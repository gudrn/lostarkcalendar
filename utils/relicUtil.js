import { AttachmentBuilder } from 'discord.js';
import { createCanvas, registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== 폰트 설정 (우분투 폰트 깨짐 대응) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 우분투 환경에서 한글 폰트가 깨질 수 있으므로, NanumGothic이 없을 경우 Noto Sans CJK KR 등 대체 폰트도 시도
const fontCandidates = [
  { path: path.join(__dirname, '../assets/fonts/NanumGothic.ttf'), family: 'NanumGothic' },
  { path: '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc', family: 'Noto Sans CJK KR' }, // 우분투 기본 한글 폰트 경로
  { path: '/usr/share/fonts/truetype/nanum/NanumGothic.ttf', family: 'NanumGothic' }, // 우분투 nanum 폰트 경로
];

let fontFamily = 'sans-serif';
for (const font of fontCandidates) {
  try {
    registerFont(font.path, { family: font.family });
    fontFamily = font.family;
    break;
  } catch (e) {
    // 폰트 등록 실패 시 무시하고 다음 후보로
  }
}

// 텍스처 깨짐 방지: 폰트 fallback, fontWeight, fontFeatureSettings, fontVariant 등 추가
function createRelicTableImage(data) {
  const rowHeight = 44;
  const colWidth = 220;
  const headerHeight = 54;
  const width = colWidth * data[0].length;
  const height = headerHeight + rowHeight * (data.length - 1);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 배경
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;

  // 텍스트 스타일 (한글 폰트 우선, fallback, fontWeight, fontVariant 등)
  ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'ltr';

  // 헤더 배경
  ctx.fillStyle = '#5865F2';
  ctx.fillRect(0, 0, width, headerHeight);
  ctx.fillStyle = '#ffffff';

  // 표 그리기
  for (let r = 0; r < data.length; r++) {
    for (let c = 0; c < data[r].length; c++) {
      const x = c * colWidth;
      const y = r === 0 ? 0 : headerHeight + (r - 1) * rowHeight;
      const cellX = x + colWidth / 2;
      const cellY = y + (r === 0 ? headerHeight : rowHeight) / 2;

      // 헤더와 바디 구분
      if (r === 0) {
        ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.font = `20px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
        ctx.fillStyle = '#e0e0e0';
      }

      // 테두리
      ctx.strokeRect(x, y, colWidth, r === 0 ? headerHeight : rowHeight);

      // 텍스트
      // 긴 텍스트 줄바꿈 처리
      const text = String(data[r][c]);
      if (text.length > 16) {
        // 2줄로 나누기
        const firstLine = text.slice(0, 16);
        const secondLine = text.slice(16, 32);
        ctx.fillText(firstLine, cellX, cellY - 10);
        ctx.fillText(secondLine, cellX, cellY + 12);
      } else {
        ctx.fillText(text, cellX, cellY);
      }
    }
  }

  return canvas.toBuffer('image/png');
}

/**
 * 유물 각인서 시세를 이미지로 만들어 AttachmentBuilder로 반환합니다.
 * @param {Array} relicItems [{ itemName, itemCurrentMinPrice }]
 * @returns {AttachmentBuilder}
 */
export const formatRelicItemsMessage = (relicItems) => {
  // 표 데이터 준비
  const tableData = [
    ['번호', '각인서 이름', '최저가(골드)'],
    ...relicItems.map((item, idx) => [
      (idx + 1).toString(),
      item.itemName,
      item.itemCurrentMinPrice !== undefined &&
      item.itemCurrentMinPrice !== null &&
      item.itemCurrentMinPrice !== ''
        ? Number(item.itemCurrentMinPrice).toLocaleString('ko-KR')
        : '',
    ]),
  ];

  const imageBuffer = createRelicTableImage(tableData);
  const attachment = new AttachmentBuilder(imageBuffer, { name: 'relic_table.png' });

  return attachment;
};
