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

export function renderTableImage(tableData, options = {}) {
  const fontFamily = getPreferredFontFamily();

  const colWidth = options.colWidth ?? 220;
  const rowHeight = options.rowHeight ?? 44;
  const headerHeight = options.headerHeight ?? 54;
  const sectionHeaderHeight = options.sectionHeaderHeight ?? headerHeight;
  const headerRowIndex = options.headerRowIndex ?? 0; // set to null/-1 to disable
  const colors = { ...defaultColors, ...(options.colors || {}) };

  const colCount = options.colCount ?? tableData.reduce((max, row) => Math.max(max, row.length), 0);

  // Determine per-row height (support header row and section headers)
  const isHeaderRow = (rIdx) => headerRowIndex !== null && headerRowIndex !== -1 && rIdx === headerRowIndex;
  const isSectionHeaderRow = (row, rIdx) => {
    if (isHeaderRow(rIdx)) return false;
    // section header if first cell has text and others are empty or missing
    if (!row || row.length === 0) return false;
    const firstHas = row[0] !== undefined && row[0] !== null && String(row[0]).length > 0;
    const othersEmpty = row.length === 1 || (row.length === 2 && String(row[1]) === '');
    return firstHas && othersEmpty;
  };

  const rowHeights = tableData.map((row, rIdx) => (isHeaderRow(rIdx) || isSectionHeaderRow(row, rIdx) ? sectionHeaderHeight : rowHeight));
  const width = colWidth * colCount;
  const height = rowHeights.reduce((sum, h) => sum + h, 0);

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // background
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
      // Draw header background across full width
      ctx.fillStyle = colors.headerBackground;
      ctx.fillRect(0, currentY, width, h);
    }

    if (isSection) {
      // Section header spans full width using first cell's text
      ctx.fillStyle = colors.sectionHeaderBackground;
      ctx.fillRect(0, currentY, width, h);
      ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
      ctx.fillStyle = colors.sectionHeaderText;
      const title = String(row[0] ?? '');
      ctx.fillText(title, width / 2, centerY);
    } else {
      // Normal row (or header row with cells)
      for (let c = 0; c < colCount; c++) {
        const x = c * colWidth;
        const cellX = x + colWidth / 2;
        const text = row && row[c] !== undefined && row[c] !== null ? String(row[c]) : '';

        // Cell border
        ctx.strokeRect(x, currentY, colWidth, h);

        if (isHeader) {
          ctx.font = `bold 22px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
          ctx.fillStyle = colors.headerText;
          ctx.fillText(text, cellX, centerY);
        } else {
          ctx.font = `20px '${fontFamily}', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Arial', sans-serif`;
          ctx.fillStyle = colors.bodyText;
          // Simple wrapping for long text (two lines)
          if (text.length > 16) {
            const firstLine = text.slice(0, 16);
            const secondLine = text.slice(16, 32);
            ctx.fillText(firstLine, cellX, centerY - 10);
            ctx.fillText(secondLine, cellX, centerY + 12);
          } else {
            ctx.fillText(text, cellX, centerY);
          }
        }
      }
    }

    currentY += h;
  }

  return canvas.toBuffer('image/png');
}


