import { useRef, useState } from 'react';
import { MessageCircle, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { demoReply, labels, quickAsks, sampleChat } from '../data/sampleChat';
import { safetyLevel, safetyReplies } from '../data/safety.mjs';
import { EmergencyLink, TeleManas } from './Shared';

function Reply({ message }) {
  return <div className={'reply ' + (message.level ? 'safety-reply' : '')}>
    <div className="reply-signature"><Sparkles size={16} /> Bridge {message.demo && <span>Sample reply</span>}</div>
    <dl>{message.parts.map((part, index) => <div key={labels[index]}><dt>{labels[index]}</dt><dd>{part}</dd></div>)}</dl>
    {message.level && <div className="reply-actions"><EmergencyLink>Call 112</EmergencyLink></div>}
  </div>;
}

export function Chat() {
  const [messages, setMessages] = useState(sampleChat);
  const [draft, setDraft] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const panel = useRef(null);
  const input = useRef(null);
  const lock = useRef(false);

  function scrollToLatest() {
    requestAnimationFrame(() => {
      if (panel.current) panel.current.scrollTop = panel.current.scrollHeight;
    });
  }

  async function send(raw) {
    const text = raw.trim();
    if (!text || lock.current) return;
    lock.current = true;
    const history = [...messages, { role: 'user', text }];
    setDraft('');
    setMessages(history);
    scrollToLatest();
    const previous = messages.slice(sampleChat.length).filter(message => message.role === 'user').slice(-3).map(message => message.text).join(' ');
    const level = safetyLevel(text, previous?.text);
    if (level) {
      setMessages([...history, { role: 'assistant', parts: safetyReplies[level], level }]);
      lock.current = false;
      scrollToLatest();
      return;
    }
    setWaiting(true);
    let reply;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(Math.max(sampleChat.length, history.findLastIndex(message => message.level) + 1)).slice(-7).map(message => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          text: (message.text ?? message.parts.join('\n')).slice(0, 2400)
        })) }),
        signal: AbortSignal.timeout(14000)
      });
      if (!response.ok) throw new Error('Gemini unavailable');
      reply = await response.json();
      if (!Array.isArray(reply.parts) || reply.parts.length !== 3) throw new Error('Invalid reply');
    } catch {
      reply = { parts: demoReply(text), demo: true };
    }
    setMessages([...history, { role: 'assistant', ...reply }]);
    setWaiting(false);
    lock.current = false;
    scrollToLatest();
  }

  const newMessages = messages.slice(sampleChat.length);
  const shown = showSamples ? messages : [...sampleChat.slice(0, 2), ...newMessages];
  return <section className="shell chat-grid" id="guidance" data-scroll-reveal aria-labelledby="guidance-title">
    <div className="chat-intro">
      <span className="section-label"><MessageCircle size={16} /> Parent guidance</span>
      <h2 id="guidance-title">Ask Bridge anything.</h2>
      <p>Start with what you’ve noticed. Tell Bridge your child’s age and what has changed, and get ideas for what to say or do next.</p>
      <div className="safety-card" id="emergency-guidance">
        <ShieldAlert size={20} aria-hidden="true" />
        <div><h3>When to call 112</h3><p>If your child is struggling to breathe, has blue or grey lips, faints, or may be having a severe allergic reaction, <EmergencyLink>call 112 now</EmergencyLink> in India. If breathing stays much faster than usual, seek urgent medical care.</p><p>For non-emergency mental health support, call <TeleManas />.</p></div>
      </div>
    </div>
    <div className="chat-column">
      <div className="chat-frame">
        <div className="chat-head">
          <div className="chat-brand"><img src="/bridge.svg" alt="" width="34" height="34" /><div><strong>Bridge Chat</strong><span>{newMessages.length ? 'Parenting guidance' : 'Sample conversation'}</span></div></div>
          <div className="chat-head-actions">
            {!newMessages.length && <button className="text-button" onClick={() => { setShowSamples(!showSamples); if (!showSamples) scrollToLatest(); }}>{showSamples ? 'Show less' : 'Show follow-up'}</button>}
            {newMessages.length > 0 && <button className="icon-button" disabled={waiting} aria-label="Reset sample chat" onClick={() => { setMessages(sampleChat); setShowSamples(false); panel.current.scrollTop = 0; input.current.focus(); }}><RotateCcw size={17} /></button>}
          </div>
        </div>
        <div ref={panel} className="chat-scroll" role="log" aria-label="Parent and Bridge conversation" tabIndex={0}>
          {shown.map((message, index) => message.role === 'user' ? <div className="question" key={index}><span className="sr-only">Parent: </span>{message.text}</div> : <Reply key={index} message={message} />)}
          {waiting && <div className="reply typing" aria-label="Bridge is typing"><i /><i /><i /></div>}
        </div>
        <div className="chat-compose">
          <div className="quick-asks" aria-label="Suggested questions">{quickAsks.map(question => <button key={question} disabled={waiting} onClick={() => send(question)}>{question}</button>)}</div>
          <form onSubmit={event => { event.preventDefault(); void send(draft); }}>
            <input id="chat-input" ref={input} aria-label="Ask Bridge a question" aria-describedby="chat-privacy" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1200} placeholder="Ask about your child…" autoComplete="off" />
            <button className="button primary send" type="submit" disabled={waiting || !draft.trim()} aria-label="Send">Send</button>
          </form>
          <small id="chat-privacy">Leave out names and identifying details. Live chat uses Gemini when available.</small>
        </div>
      </div>
      <p className="chat-disclaimer">We are here to help. What Bridge says is general guidance, not medical advice or a diagnosis. Treat it as suggestions to follow, and speak to a qualified professional about any medical concern.</p>
    </div>
  </section>;
}
