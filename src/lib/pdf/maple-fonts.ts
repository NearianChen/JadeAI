import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { MAPLE_FONT_FAMILY } from '@/lib/resume-theme';

let embeddedFonts: Promise<string> | undefined;

/** Embed local fonts so downloaded HTML and headless PDF need no font server. */
export function mapleFontCSS(): Promise<string> {
  if (!embeddedFonts) {
    embeddedFonts = Promise.all([
      { file: 'Regular', weight: 400, style: 'normal' },
      { file: 'Bold', weight: 700, style: 'normal' },
      { file: 'Italic', weight: 400, style: 'italic' },
    ].map(async ({ file, weight, style }) => {
      const font = await readFile(path.join(process.cwd(), 'public', 'fonts', `MapleMono-NF-CN-${file}.ttf`));
      return `@font-face {
        font-family: '${MAPLE_FONT_FAMILY}';
        src: url('data:font/ttf;base64,${font.toString('base64')}') format('truetype');
        font-weight: ${weight};
        font-style: ${style};
      }`;
    })).then((faces) => faces.join('\n')).catch((error) => {
      embeddedFonts = undefined;
      throw error;
    });
  }
  return embeddedFonts;
}
