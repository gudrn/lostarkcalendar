import { createCanvas } from 'canvas';
import { getPreferredFontFamily } from './fonts.js';

const defaultColors = {
  background: '#23272A',
  border: '#ffffff',
  headerBackground: '#5865F2',
  headerText: '#ffffff',
  bodyText: '#e0e0e0',
  sectionHeaderBackground: '#FEE500',
  sectionHeaderText: '#23272A',
};

/**
 * 주어진 테이블 데이터를 이미지로 변환하여 렌더링하는 함수입니다.
 * @param {Array<Array<string|number>>} tableData - 렌더링할 테이블 데이터 (2차원 배열)
 * @param {Object} [options] - 렌더링 옵션 객체
 * @param {number} [options.colWidth] - 컬럼(열) 너비 (기본값: 220, 두번째 셀은 1.5배)
 * @param {number} [options.rowHeight] - 일반 행 높이 (기본값: 44)
 * @param {number} [options.headerHeight] - 헤더 행 높이 (기본값: 54)
 * @param {number} [options.sectionHeaderHeight] - 섹션 헤더 행 높이 (기본값: headerHeight)
 * @param {number} [options.headerRowIndex] - 헤더 행 인덱스 (기본값: 0, null 또는 -1로 비활성화)
 * @param {Object} [options.colors] - 색상 커스터마이즈 옵션
 * @param {number} [options.colCount] - 컬럼 개수 강제 지정 (기본값: 데이터에서 자동 계산)
 * @returns {Canvas} - 렌더링된 이미지(Canvas) 객체
 */
export function renderTableImage(tableData, options = {}) {
  const fontFamily = getPreferredFontFamily();

  const colWidth = options.colWidth ?? 220;
  const secondColRatio = 1.5; // 두번째 셀을 1.5배로
  const rowHeight = options.rowHeight ?? 44;
  const headerHeight = options.headerHeight ?? 54;
  const sectionHeaderHeight = options.sectionHeaderHeight ?? headerHeight;
  const headerRowIndex = options.headerRowIndex ?? 0; // null 또는 -1로 비활성화 가능
  const colors = { ...defaultColors, ...(options.colors || {}) };

  const colCount = options.colCount ?? tableData.reduce((max, row) => Math.max(max, row.length), 0);

  // 각 열의 너비 배열 생성 (colCount가 3 이하일 때는 두번째 셀도 기본 너비)
  const colWidths = [];
  for (let i = 0; i < colCount; i++) {
    if (colCount > 2 && i === 1) {
      colWidths.push(colWidth * secondColRatio);
    } else {
      colWidths.push(colWidth);
    }
  }

  // 전체 테이블의 너비 계산
  const width = colWidths.reduce((sum, w) => sum + w, 0);

  // 각 행이 헤더인지, 섹션 헤더인지 판별
  const isHeaderRow = (rIdx) =>
    headerRowIndex !== null && headerRowIndex !== -1 && rIdx === headerRowIndex;
  const isSectionHeaderRow = (row, rIdx) => {
    if (isHeaderRow(rIdx)) return false;
    if (!row || row.length === 0) return false;
    const firstHas = row[0] !== undefined && row[0] !== null && String(row[0]).length > 0;
    const othersEmpty = row.length === 1 || (row.length === 2 && String(row[1]) === '');
    return firstHas && othersEmpty;
  };

  const rowHeights = tableData.map((row, rIdx) =>
    isHeaderRow(rIdx) || isSectionHeaderRow(row, rIdx) ? sectionHeaderHeight : rowHeight,
  );
  const height = rowHeights.reduce((sum, h) => sum + h, 0);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 배경 그리기
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'ltr';

  let currentY = 0;
  for (let r = 0; r < tableData.length; r++) {
    const row = tableData[r];
    const isHeader = isHeaderRow(r);
    const isSection = isSectionHeaderRow(row, r);
    const h = rowHeights[r];
    const centerY = currentY + h / 2;

    if (isHeader) {
      // 헤더 배경 전체 그리기
      ctx.fillStyle = colors.headerBackground;
      ctx.fillRect(0, currentY, width, h);
    }

    if (isSection) {
      // 섹션 헤더는 첫 번째 셀의 텍스트로 전체 폭에 표시
      ctx.fillStyle = colors.sectionHeaderBackground;
      ctx.fillRect(0, currentY, width, h);
      ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
      ctx.fillStyle = colors.sectionHeaderText;
      const title = String(row[0] ?? '');
      ctx.fillText(title, width / 2, centerY);
    } else {
      // 일반 행 또는 헤더 행
      let x = 0;
      for (let c = 0; c < colCount; c++) {
        const cellWidth = colWidths[c];
        const cellX = x + cellWidth / 2;
        const text = row && row[c] !== undefined && row[c] !== null ? String(row[c]) : '';

        // 셀 테두리
        ctx.strokeRect(x, currentY, cellWidth, h);

        if (isHeader) {
          ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
          ctx.fillStyle = colors.headerText;
          ctx.fillText(text, cellX, centerY);
        } else {
          ctx.font = `20px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
          ctx.fillStyle = colors.bodyText;
          // 긴 텍스트는 두 줄로 나눠서 표시
          if (text.length > 16) {
            const firstLine = text.slice(0, 16);
            const secondLine = text.slice(16, 32);
            ctx.fillText(firstLine, cellX, centerY - 10);
            ctx.fillText(secondLine, cellX, centerY + 12);
          } else {
            ctx.fillText(text, cellX, centerY);
          }
        }
        x += cellWidth;
      }
    }

    currentY += h;
  }

  return canvas.toBuffer('image/png');
}
