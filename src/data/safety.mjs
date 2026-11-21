// Check the latest message without sending it to an external service.
const immediate = /(?:can(?:not|['’]t)|unable to|isn['’]t|not)\s+(?:\w+\s+){0,2}(?:breath(?:e|ing)?\b|get(?:ting)? (?:enough )?air)|(?:struggl\w+|hard time|trouble|difficult\w*|hard|work\w+)\s+(?:(?:to|with|for|at|each|a|every|while|their|his|her|my)\s+){0,3}breath|gasp\w*|chok\w*|anaphylax\w*|(?:blue|bluish|grey|gray)\s+lips|lips.{0,16}(?:blue|grey|gray)|(?:passed|passing) out|faint(?:ed|ing|s)?\b|unresponsive|unconscious|(?:throat|tongue).{0,16}swell|swell.{0,16}(?:throat|tongue)|(?:ribs|chest).{0,28}(?:pulling|sucking) in|kill\s+(?:my|him|her|them)sel[fv]|suicid\w*|self[ -]?harm|(?:hurt|harm|cut)\s+(?:myself|himself|herself|themselves)|overdos\w*|(?:immediate|in) danger|being abus\w*|sexual(?:ly)? abus\w*/i;
const urgent = /panic attack|hyperventilat\w*|wheez\w*|short(?:ness)? of breath|rapid (?:breathing|breaths)|breath\w*.{0,25}(?:fast|quick|wrong|properly|hard)|(?:fast|quick) breathing|out of breath|breathlessness|asthma attack|allergic reaction|chest (?:pain|hurts)|hopelessness/i;
const context = /\b(?:breath\w*|asthma|allerg\w*|panic|wheez\w*|chest)\b/i;
const improving = /calm(?:ing|ed)? down|slow(?:ing|ed) down|breathing (?:is )?(?:back to normal|normally)|getting better/i;
const worsening = /still|worse|won['’]t stop|not stopping|not slowing|hasn['’]t stopped/i;

export function safetyLevel(message, prior = '') {
  const text = message.replace(/\s+/g, ' ').trim();
  if (immediate.test(text)) return 'emergency';
  if (urgent.test(text) || (context.test(prior) && worsening.test(text))) return 'urgent';
  if (context.test(prior) && improving.test(text)) return 'followup';
  return null;
}

export const safetyReplies = {
  emergency: [
    'This could be an emergency.',
    'Call 112 now in India if your child is struggling to breathe, has blue or grey lips, has fainted or is hard to wake, may be having a severe allergic reaction, or is in immediate danger. Follow the dispatcher’s instructions.',
    'Stay with your child if it’s safe. If you’re outside India, call your local emergency number.'
  ],
  followup: [
    'It’s encouraging that your child is calmer. Check whether their breathing is back to normal.',
    'Stay nearby and speak gently. If breathing is still unusually fast, seek urgent medical care. Call 112 now if breathing becomes difficult or any emergency sign appears.',
    'If this is the first unexplained episode or it happens again, contact your child’s doctor.'
  ],
  urgent: [
    'Fast or unusual breathing can have several causes, including asthma or an allergic reaction. A chat cannot tell which one it is.',
    'Call 112 now if your child is struggling to breathe, can barely speak or cry, has blue or grey lips, faints, or may be having a severe allergic reaction.',
    'If breathing is still much faster than usual or you are unsure what is causing it, seek urgent medical care now. If breathing has returned to normal, stay with them and ask their doctor about a first or recurring episode.'
  ]
};
