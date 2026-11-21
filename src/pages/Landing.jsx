import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Water } from '../components/Art';
import { BridgeStory } from '../components/BridgeStory';
import { Chat } from '../components/Chat';
import { Insights, Stats } from '../components/Insights';
import { InstantCall, Professionals } from '../components/Professionals';
import { EmergencyLink, SectionHeading, setupCardGlow, TeleManas } from '../components/Shared';
import { faqs } from '../data/faqs';
import { useScrollStory } from '../useScrollStory';

const plans = [
  ['Free Trial', '₹0', 'for 7 days', 'Explore Bridge and try the parenting chat.', 'Start free trial'],
  ['Plan', '₹369', '/ month', 'Unlimited Chats.', 'Choose plan'],
  ['Personal Psychologist', '₹599', '/ session', 'Individual support from a psychologist.', 'View psychologists']
];

export function Landing() {
  const page = useRef(null);
  const selectChapter = useScrollStory(page);

  return <main id="main" ref={page} className="landing">
    <BridgeStory selectChapter={selectChapter} />
    <Stats />
    <Water />
    <Chat />
    <Water />
    <Insights />
    <Professionals />
    <section className="shell section-space" id="plans" aria-labelledby="plans-title">
      <SectionHeading id="plans-title">Plans and pricing</SectionHeading>
      <div className="cards-three" data-scroll-reveal>{plans.map(([name, price, unit, detail, action], index) => <article className={'plan-card glow ' + (index === 1 ? 'monthly-plan' : '')} key={name} onPointerMove={setupCardGlow}>
        <h3>{name}</h3><p className="plan-price"><strong>{price}</strong> <span>{unit}</span></p><p>{detail}</p>
        <Link className={'button ' + (index === 1 ? 'light-button' : 'secondary')} to={index === 2 ? '/#psychologists' : '/checkout'}>{action}</Link>
      </article>)}</div>
    </section>
    <InstantCall />
    <section className="shell section-space faq" aria-labelledby="faq-title">
      <SectionHeading id="faq-title">Frequently asked questions</SectionHeading>
      <div className="faq-list" data-scroll-reveal>{faqs.map(([question, answer]) => <details key={question} name="bridge-faq">
        <summary>{question}<ChevronDown size={18} aria-hidden="true" /></summary>
        <p>{answer === 'emergency' ? <>If your child is in immediate danger in India, <EmergencyLink>call 112 now</EmergencyLink>. For mental health support when there is no immediate danger, call <TeleManas />.</> : answer}</p>
      </details>)}</div>
    </section>
  </main>;
}
