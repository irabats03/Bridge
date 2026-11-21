export const stats = [
  { number: 5, format: (n: number) => '1 in ' + n, label: 'students rarely feel calm, motivated, or excited.' },
  { number: 40, format: (n: number) => 'About ' + n + '%', label: 'don’t know where to go for mental health support at school.' },
  { number: 6, format: (n: number) => 'Nearly ' + n + ' in 10', label: 'NEET aspirants in one study showed symptoms of depression.' }
];
export const scores = [38, 44, 49, 55, 61, 66, 72, 78];
export const needs = [
  ['Academic pressure', 30, 70], ['Friendship issues', 55, 60],
  ['Sleep', 40, 65], ['Screen time', 70, 45], ['Wanting to be heard', 25, 85]
] as const;
export const warningSigns = [
  'Sudden withdrawal from friends or family', 'Big changes in sleep or appetite',
  'A drop in school performance', 'Loss of interest in favourite activities',
  'Frequent unexplained physical complaints', 'Talk of hopelessness'
];
