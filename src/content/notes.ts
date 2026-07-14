// ── 短笔记（在 moments 时间线中展示）──
export interface Note {
  type: 'note';
  date: string;
  time: string;
  content: string;
  image?: string;
}

export const notes: Note[] = [
  { type: 'note', date: '2026-07-11', time: '22:00', content: '不知道写些什么(´-ω-`)', image: 'src/assets/img/test_image.jpg' },
];
