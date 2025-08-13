import { registerFont } from 'canvas';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 시스템에 설치된 한글 폰트 중 사용 가능한 폰트를 우선순위대로 등록하고,
 * 사용 가능한 폰트 패밀리명을 반환합니다.
 * @returns {string} 사용 가능한 폰트 패밀리명
 */
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
      // 폰트 등록 실패 시 다음 후보로 넘어감
      continue;
    }
  }
  return family;
}
