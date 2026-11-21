import { useEffect, useRef, useState } from 'react';
import { Activity, ChartNoAxesColumnIncreasing, MessageCircle, ShieldAlert } from 'lucide-react';
import { useInView, useMotion } from '../MotionContext';
import { needs, scores, stats, warningSigns } from '../data/stats';
import { SectionHeading, setupCardGlow } from './Shared';

function Count({ value, format, active }) {
  const { motion } = useMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!active || !motion) return;
    const start = performance.now();
    let frame;
    function tick(now) {
      const fraction = Math.min(1, (now - start) / 850);
      setCount(Math.round(value * (1 - (1 - fraction) ** 3)));
      if (fraction < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, motion, value]);
  return <><span aria-hidden="true">{format(motion && active ? count : value)}</span><span className="sr-only">{format(value)}</span></>;
}

export function Stats() {
  const ref = useRef(null);
  const visible = useInView(ref);
  return <section className="shell stats-section" ref={ref} aria-labelledby="stats-title">
    <div className="stats-heading"><h2 id="stats-title">Student wellbeing in India</h2><span>Illustrative figures · sources pending verification</span></div>
    <div className="stats-grid" data-scroll-reveal>{stats.map(({ number, format, label }) => <article key={number} className="stat-card">
      <strong><Count value={number} format={format} active={visible} /></strong><p>{label}</p>
      <small>Source: as cited in India student wellbeing reports</small>
    </article>)}</div>
  </section>;
}

const featureCards = [
  ['Guidance', 'Ask anything and get an answer in three clear parts: what might be happening, what to do now, and next steps.', MessageCircle, 'feature-typing', '#guidance', 'Try Bridge Chat'],
  ['Help along the way', 'See how well your guesses match what your child actually needs, and spot early signs.', ChartNoAxesColumnIncreasing, 'feature-bars', '#insights', 'See sample insights'],
  ['Expert help', 'Talk to qualified psychologists, or reach someone right now.', Activity, 'feature-heart', '#psychologists', 'Meet the psychologists']
];

function LineChart() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const x = index => 49 + index * 46;
  const y = score => 160 - score * 1.36;
  const points = scores.map((score, index) => x(index) + ',' + y(score)).join(' ');
  return <article ref={ref} className={'chart-card ' + (visible ? 'in-view' : '')} onPointerMove={setupCardGlow}>
    <h3>How well your guesses match what your child needs</h3>
    <p className="chart-caption">Match score over eight weeks</p>
    <svg className="score-chart" viewBox="0 0 400 198" aria-hidden="true">
      {[0, 25, 50, 75, 100].map(score => <g key={score}>
        <path d={'M43 ' + y(score) + 'H382'} className="gridline" />
        <text x="37" y={y(score) + 4} textAnchor="end">{score}%</text>
      </g>)}
      <polygon points={'49,160 ' + points + ' 371,160'} className="line-area" />
      <polyline points={points} pathLength="1" className="chart-line" />
      {scores.map((score, index) => <g key={score}>
        <circle cx={x(index)} cy={y(score)} r="4" className="chart-point" />
        <text x={x(index)} y={y(score) - 9} className="point-label" textAnchor="middle">{score}%</text>
        <text x={x(index)} y="180" textAnchor="middle">{'W' + (index + 1)}</text>
      </g>)}
    </svg>
    <p className="sr-only">{scores.map((score, index) => 'Week ' + (index + 1) + ': ' + score + '%').join(', ')}</p>
  </article>;
}

function Bars() {
  const ref = useRef(null);
  const visible = useInView(ref);
  return <article ref={ref} className={'chart-card ' + (visible ? 'in-view' : '')} onPointerMove={setupCardGlow}>
    <h3>Your guess vs their need</h3>
    <div className="legend"><span><i /> Your guess</span><span><i /> Their need</span></div>
    <div className="bar-chart">{needs.map(([title, guess, need]) => <div className="bar-category" key={title}>
      <h4>{title}</h4>
      <div className="bar-pair" aria-label={title + ': your guess ' + guess + '%, their need ' + need + '%'}>
        <div><i className="bar guess" style={{ width: guess + '%' }} /><small><Count value={guess} format={n => String(n)} active={visible} /></small></div>
        <div><i className="bar need" style={{ width: need + '%' }} /><small><Count value={need} format={n => String(n)} active={visible} /></small></div>
      </div>
    </div>)}</div>
  </article>;
}

export function Insights() {
  return <section className="shell section-space" id="why-us" aria-labelledby="why-title">
    <SectionHeading id="why-title">Why parents use Bridge</SectionHeading>
    <div className="cards-three" data-scroll-reveal>{featureCards.map(([title, description, Icon, animation, href, action]) => <article className="feature-card glow" key={title} onPointerMove={setupCardGlow}>
      <div className={'feature-icon ' + animation}>
        {animation === 'feature-typing' ? <div className="typing" aria-hidden="true"><i /><i /><i /></div> : <Icon size={23} aria-hidden="true" />}
      </div>
      <h3>{title}</h3><p>{description}</p><a href={href}>{action}</a>
    </article>)}</div>
    <div className="insights" id="insights">
      <SectionHeading id="insights-title">Insights over time</SectionHeading>
      <div className="charts-grid" data-scroll-reveal><LineChart /><Bars /></div>
      <p className="sample-note">Sample data for illustration.</p>
      <aside className="alert-card">
        <div><span className="feature-icon"><ShieldAlert size={22} /></span><h3>Signs your child may need support</h3><a className="button secondary" href="#instant-call">Talk to someone now</a></div>
        <ul>{warningSigns.map(sign => <li key={sign}>{sign}</li>)}</ul>
      </aside>
    </div>
  </section>;
}
