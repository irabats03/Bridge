import { Link } from 'react-router-dom';
import { Activity, CalendarDays, HeartHandshake, MessageCircle, Sparkles } from 'lucide-react';
import { BridgeArt } from './Art';
import { psychologists } from '../data/psychologists';
import '../story.css';

const chapters = [
  { name: 'Overview', label: 'Parenting guidance for ages 4–18', title: 'Understand what your child is really going through.', detail: 'Bridge helps you talk openly, rebuild trust, and support your child through school pressure, emotions, and everything in between.' },
  { name: 'Guidance', label: 'Bridge Chat', title: 'Find the words to start.', detail: 'Ask about a change you’ve noticed. Get ideas for what might be happening, what you can say, and when to ask for help.' },
  { name: 'Insights', label: 'Sample insights', title: 'See the patterns over time.', detail: 'Explore how needs can change across school, friendships, and home. Notice signs that your child may need more support.' },
  { name: 'Expert help', label: 'Psychologist directory', title: 'Find someone to talk to.', detail: 'Explore sample psychologist profiles by focus and language, and see how booking a session works.' },
];

function ChatPreview() {
  return <div className="story-mock story-chat">
    <div className="story-mock-head"><span className="story-icon"><Sparkles size={20} /></span><div><strong>Bridge Chat</strong><small>Sample conversation</small></div></div>
    <div className="story-chat-body">
      <p className="story-bubble story-bubble-parent">My teen has been keeping to himself lately. How can I check in?</p>
      <div className="story-bubble story-bubble-bridge"><strong>What to do now</strong><p>Pick a quiet moment together. Try “I’m here when you want to talk,” and give him room to answer.</p></div>
      <div className="story-chip"><MessageCircle size={15} /> Start with one question</div>
    </div>
  </div>;
}

function InsightPreview() {
  return <div className="story-mock story-insights">
    <div className="story-mock-head"><span className="story-icon"><Activity size={20} /></span><div><strong>Sample insights</strong><small>Eight weeks of illustrative data</small></div></div>
    <div className="story-chart">
      <svg viewBox="0 0 320 130" role="presentation">
        <path d="M6 24H314M6 54H314M6 84H314M6 114H314" className="story-chart-grid" />
        <path d="M6 104C51 103 62 87 95 82S130 84 160 70S184 51 222 46S260 46 314 18V120H6Z" className="story-chart-area" />
        <path d="M6 104C51 103 62 87 95 82S130 84 160 70S184 51 222 46S260 46 314 18" pathLength="1" className="story-chart-line" />
      </svg>
      <div className="story-chart-weeks"><span>Week 1</span><span>Week 8</span></div>
    </div>
    <div className="story-chip"><Activity size={15} /> See what’s changing over time</div>
  </div>;
}

function SupportPreview() {
  return <div className="story-mock story-support">
    <div className="story-mock-head"><span className="story-icon"><HeartHandshake size={21} /></span><div><strong>Expert help</strong><small>Sample psychologist profiles</small></div></div>
    <div className="story-profile-list">{psychologists.slice(0, 2).map(profile => <div className="story-profile" key={profile.name}>
      <span className="story-avatar">{profile.initials}</span><div><strong>{profile.name}</strong><small>{profile.focus}</small></div><CalendarDays className="story-calendar" size={18} />
    </div>)}</div>
    <div className="story-chip"><HeartHandshake size={15} /> Explore support that fits</div>
  </div>;
}

const visuals = [BridgeArt, ChatPreview, InsightPreview, SupportPreview];

export function BridgeStory({ selectChapter }) {
  return <section className="bridge-story" aria-labelledby="hero-title">
    <div className="story-stage">
      <div className="story-backdrops" aria-hidden="true">
        {chapters.map(chapter => <div className="story-backdrop" key={chapter.name} />)}
      </div>
      <div className="shell story-inner">
        <div className="story-grid">
          <div className="story-text">
            {chapters.map((chapter, index) => <div className="story-copy" key={chapter.name} aria-hidden={index === 0 ? undefined : true}>
              <p className="story-eyebrow"><span />{chapter.label}</p>
              {index === 0 ? <h1 id="hero-title">{chapter.title}</h1> : <p className="story-title">{chapter.title}</p>}
              <p className="story-detail">{chapter.detail}</p>
            </div>)}
          </div>
          <div className="story-visuals" aria-hidden="true">
            {visuals.map((Visual, index) => <div className="story-visual" key={chapters[index].name}><Visual /></div>)}
          </div>
        </div>
        <div className="story-footer">
          <div className="story-actions">
            <Link className="button story-primary" to="/checkout">Start your free 7-day trial</Link>
            <Link className="button story-secondary" to="/#guidance" state={{ focus: 'chat-input' }}><MessageCircle size={17} />Ask Bridge anything</Link>
          </div>
          <nav className="story-chapters" aria-label="Bridge story chapters">
            {chapters.map((chapter, index) => <button type="button" className="story-chapter" key={chapter.name} aria-current={index === 0 ? 'step' : undefined} onClick={() => selectChapter(index)}>
              <span className="story-chapter-track" aria-hidden="true"><i /></span><span>{chapter.name}</span>
            </button>)}
          </nav>
        </div>
      </div>
    </div>
    <div className="story-runway" aria-hidden="true" />
  </section>;
}
