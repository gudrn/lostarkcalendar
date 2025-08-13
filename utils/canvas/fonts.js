import { registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getPreferredFontFamily() {
  const candidates = [
    { path: path.join(__dirname, '../../assets/fonts/NanumGothic.ttf'), family: 'NanumGothic' },
    { path: '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc', family: 'Noto Sans CJK KR' },
    { path: '/usr/share/fonts/truetype/nanum/NanumGothic.ttf', family: 'NanumGothic' },
  ];

  let family = 'sans-serif';
  for (const font of candidates) {
    try {
      registerFont(font.path, { family: font.family });
      family = font.family;
      break;
    } catch (e) {
      // ignore and try next
    }
  }
  return family;
}


