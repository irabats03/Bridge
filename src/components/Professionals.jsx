import { useState } from 'react';
import { CalendarDays, Check, ChevronDown, Globe2, Phone, ShieldAlert } from 'lucide-react';
import { languages, psychologists } from '../data/psychologists';
import { EmergencyLink, Modal, SectionHeading, setupCardGlow } from './Shared';

function Profile({ profile, onBook }) {
  return <article className="profile-card glow" onPointerMove={setupCardGlow}>
    <div className="profile-head"><span className="avatar">{profile.initials}</span><div><h3>{profile.name}</h3><p>{profile.qualification}</p></div></div>
    <p className="profile-focus">{profile.focus}</p>
    <p className="profile-detail"><CalendarDays size={16} />{profile.years} years’ experience</p>
    <p className="profile-detail"><Globe2 size={16} />{profile.languages.join(', ')}</p>
    <div className="profile-bottom"><div><strong>₹599</strong> <span>per session</span><p>{profile.availability}</p></div><button className="button secondary" onClick={() => onBook(profile)}>Book a call</button></div>
  </article>;
}

function Booking({ profile, onClose }) {
  const [slot, setSlot] = useState(profile.slots[0]);
  const [booked, setBooked] = useState(false);
  return <Modal title={booked ? 'Demo booking confirmed' : 'Book a call'} onClose={onClose}>
    {booked ? <div className="success-inline"><Check size={23} /><p>You selected {slot} with {profile.name}. No payment was taken and no real appointment was made.</p><button className="button primary" onClick={onClose}>Done</button></div> :
      <form className="form-stack" onSubmit={event => { event.preventDefault(); setBooked(true); }}>
        <p><strong>{profile.name}</strong><br />₹599 per session · Demo booking</p>
        <label>Choose a slot<select value={slot} onChange={event => setSlot(event.target.value)}>{profile.slots.map(time => <option key={time}>{time}</option>)}</select></label>
        <button className="button primary">Confirm at ₹599</button>
      </form>}
  </Modal>;
}

export function Professionals() {
  const [list, setList] = useState(false);
  const [booking, setBooking] = useState(null);
  const openBooking = profile => { setList(false); setBooking(profile); };
  return <section className="shell section-space" id="psychologists" aria-labelledby="psychologists-title">
    <SectionHeading id="psychologists-title" description="Explore sample profiles by focus and language." action={<button className="button secondary" onClick={() => setList(true)}>See all</button>}>Meet the psychologists</SectionHeading>
    <div className="cards-three" data-scroll-reveal>{psychologists.slice(0, 3).map(profile => <Profile key={profile.name} profile={profile} onBook={openBooking} />)}</div>
    {list && <Modal title="All demo profiles" onClose={() => setList(false)}><div className="profile-list">{psychologists.map(profile => <Profile key={profile.name} profile={profile} onBook={openBooking} />)}</div></Modal>}
    {booking && <Booking profile={booking} onClose={() => setBooking(null)} />}
  </section>;
}

export function InstantCall() {
  const [language, setLanguage] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [selection, setSelection] = useState('');
  const available = psychologists.filter(profile => profile.availability === 'Available now' && (!language || profile.languages.includes(language)));
  const selected = available.find(profile => profile.name === selection) ?? available[0];

  return <section className="shell section-space" id="instant-call" aria-labelledby="instant-title">
    <div className="instant-card" data-scroll-reveal>
      <div className="instant-intro">
        <span className="feature-icon"><Phone size={22} /></span><h2 id="instant-title">Need to talk to someone now?</h2>
        <p>See who’s available in this demo and choose the language you’re most comfortable speaking.</p>
        <p className="instant-emergency"><ShieldAlert size={19} /><span>For immediate danger in India, <EmergencyLink>call 112 now</EmergencyLink>.</span></p>
      </div>
      <div className="instant-options">
        {connecting ? <div className="connecting" role="status">
          <span className="pulse-icon"><Phone size={24} /></span>
          <h3>Connecting you now</h3><p>Demo with {selected?.name}. No real payment or call.</p>
          <button className="button secondary" onClick={() => setConnecting(false)}>Back to availability</button>
        </div> : <>
          <label>Preferred language<span className="select-wrap"><select value={language} onChange={event => { setLanguage(event.target.value); setSelection(''); }}><option value="">All languages</option>{languages.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></span></label>
          {available.length ? <label>Available now<span className="select-wrap"><select value={selected.name} onChange={event => setSelection(event.target.value)}>{available.map(profile => <option key={profile.name}>{profile.name}</option>)}</select><ChevronDown size={16} /></span></label> : <p role="status">No demo profiles are available in {language} right now. Try another language.</p>}
          <button className="button primary" disabled={!selected} onClick={() => setConnecting(true)}>Pay ₹599</button>
          <small>Demo only. No real payment or call.</small>
        </>}
      </div>
    </div>
  </section>;
}
