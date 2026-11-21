export const labels = ['What might be happening', 'What to do now', 'Next steps'];
export const demoEmail = 'parent@bridge.demo';
export const demoPassword = 'Bridge@2026';

export const sampleChat = [
  { role: 'user', text: 'My 14-year-old has stopped talking to me after dinner and stays in his room. Is this normal?' },
  { role: 'assistant', parts: [
    'At 14, wanting more privacy and pulling back a little are common. Notice whether this comes with changes in sleep, appetite, marks or mood.',
    'Offer a low-pressure moment together, like a walk or a snack. Try “I’m here when you want to talk,” and give him room to answer.',
    'Keep an eye on the pattern over the next two weeks. If he withdraws further or loses interest in things he loved, speak with a qualified child psychologist.'
  ] },
  { role: 'user', text: 'His exam results were bad. How do I bring it up without making it worse?' },
  { role: 'assistant', parts: [
    'He may be disappointed or worried about letting you down. At 14, a tough result can feel bigger than the exam itself.',
    'Choose a quiet moment and ask, “How are you feeling about the results?” Listen first. Tell him that one result doesn’t change how you feel about him.',
    'When he’s ready, pick one manageable next step together, like asking his teacher what to practise. Seek support if low mood or withdrawal persists.'
  ] }
];

export const quickAsks = ['My child is always angry', 'Exam stress', 'Too much screen time', 'My teen won’t open up', 'Trouble sleeping'];
const replies = [
  ['Anger can show up when a child feels overwhelmed, unheard or tired. What happened just before it started may give you a clue.', 'Keep your voice steady. Once things settle, try “That felt hard. What happened from your side?” Set a clear limit if anyone could get hurt.', 'Look for patterns across sleep, school and transitions. If anger is frequent, intense or affecting daily life, speak with a qualified professional.'],
  sampleChat[3].parts,
  ['Screens can be a way to relax or stay connected. Watch what gets crowded out, such as sleep, meals, family time or things they enjoy.', 'Agree together on one predictable screen-free time and offer an activity they can help choose.', 'Try the plan for a week and check in. If screen habits regularly disrupt daily life, ask a qualified professional for guidance.'],
  sampleChat[1].parts,
  ['Stress, changing routines and late screen use can make it harder to settle. Ask your child what bedtime feels like lately.', 'Set a predictable wind-down time and offer a quiet activity they enjoy. Make room to talk about worries earlier in the evening.', 'If poor sleep keeps happening or affects daytime life, speak with your child’s doctor.']
];

export function demoReply(message: string) {
  const matchers = [/angr|temper/, /exam|marks|results|school pressure/, /screen|gaming|phone/, /teen|open up|withdraw/, /sleep|bedtime/];
  const index = matchers.findIndex(pattern => pattern.test(message.toLowerCase()));
  return index < 0 ? [
    'A change in behaviour can reflect many things, such as a change in routine, stress or a growing need for independence.',
    'Choose a quiet moment and share one thing you’ve noticed. Listen to their side and give them time to respond.',
    'If the change persists, gets worse or affects daily life, speak with a qualified professional.'
  ] : replies[index];
}
