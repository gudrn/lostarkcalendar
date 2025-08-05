import { AttachmentBuilder } from 'discord.js';
import { createCanvas, registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

// ===== 폰트 설정 =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontPath = path.join(__dirname, '../assets/fonts/NanumGothic.ttf');

try {
  registerFont(fontPath, { family: 'NanumGothic' });
} catch (e) {
  // 이미 등록된 경우 무시
}

// ===== 보석 등급별 그룹화 =====
/**
 * 보석 배열을 등급별로 그룹화합니다.
 * @param {Array} arrGemItems
 * @returns {Object} { [등급]: [보석, ...] }
 */
export function groupGemstonesByGrade(arrGemItems) {
  return arrGemItems.reduce((acc, gem) => {
    const gradeMatch = gem.name.match(/(전설|유물|고대)/);
    const grade = gradeMatch ? gradeMatch[1] : '기타';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(gem);
    return acc;
  }, {});
}

// ===== 보석 시세 표 이미지 생성 =====
/**
 * 등급별로 그룹화된 보석 데이터를 표 이미지로 만듭니다.
 * @param {Object} groupByGrade
 * @returns {Buffer}
 */
function createGemstoneTableImage(groupByGrade) {
  const grades = Object.keys(groupByGrade);
  const tableData = [];

  // 표 데이터 구성: 등급 헤더 + 각 보석
  for (const grade of grades) {
    tableData.push([`${grade} 보석 시세`, '']);
    groupByGrade[grade].forEach((gem) => {
      const nameWithoutGrade = gem.name.replace(/^(전설|유물|고대)\s*/, '');
      tableData.push([
        nameWithoutGrade,
        gem.buyPrice !== undefined && gem.buyPrice !== null && gem.buyPrice !== ''
          ? Number(gem.buyPrice).toLocaleString('ko-KR') + '골드'
          : '',
      ]);
    });
  }

  // 표 스타일 설정
  const rowHeight = 44;
  const colWidth = 220;
  const headerHeight = 54;
  const colCount = 2;
  const width = colWidth * colCount;
  const height = headerHeight + rowHeight * (tableData.length - 1);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 배경
  ctx.fillStyle = '#23272A';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'ltr';

  // 표 그리기
  for (let r = 0; r < tableData.length; r++) {
    for (let c = 0; c < colCount; c++) {
      const x = c * colWidth;
      const y = r === 0 ? 0 : headerHeight + (r - 1) * rowHeight;
      const cellX = x + colWidth / 2;
      const cellY = y + (r === 0 ? headerHeight : rowHeight) / 2;

      // 등급 헤더 행
      if (c === 0 && tableData[r][0] && tableData[r][1] === '') {
        ctx.fillStyle = '#FEE500';
        ctx.fillRect(0, y, width, r === 0 ? headerHeight : rowHeight);
        ctx.font =
          "bold 22px 'NanumGothic', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif";
        ctx.fillStyle = '#23272A';
        ctx.fillText(tableData[r][0], width / 2, cellY);
        break; // 등급 헤더는 한 줄만
      } else if (r === 0 && tableData[r][1] === '') {
        // 첫 행(전체 헤더)은 없음
        continue;
      } else {
        ctx.font =
          "20px 'NanumGothic', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif";
        ctx.fillStyle = '#e0e0e0';
        ctx.strokeRect(x, y, colWidth, rowHeight);
        const text = String(tableData[r][c] ?? '');
        ctx.fillText(text, cellX, cellY);
      }
    }
  }

  return canvas.toBuffer('image/png');
}

// ===== 보석 시세 이미지 Attachment 반환 =====
/**
 * 그룹화된 보석 데이터를 이미지로 만들어 AttachmentBuilder로 반환합니다.
 * @param {Object} groupByGrade
 * @returns {AttachmentBuilder}
 */
export function formatGemstonePrices(groupByGrade) {
  const imageBuffer = createGemstoneTableImage(groupByGrade);
  return new AttachmentBuilder(imageBuffer, { name: 'gemstone_table.png' });
}
