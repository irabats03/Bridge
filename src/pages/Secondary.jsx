import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Check, ChevronDown, CreditCard, Smartphone } from 'lucide-react';
import { EmergencyLink, TeleManas } from '../components/Shared';
import { demoEmail } from '../data/sampleChat';

function Input({ name, label, errors, ...props }) {
  return <div className="form-field"><label htmlFor={name}>{label}</label><input id={name} name={name} {...props} aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? name + '-error' : undefined} />
    {errors[name] && <small className="form-error" id={name + '-error'}>{errors[name]}</small>}
  </div>;
}

function validateCheckout(data, method) {
  const errors = {};
  if (!data.name.trim()) errors.name = 'Enter a name for the demo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Enter an email address such as parent@bridge.demo.';
  if (!/^(?:\+91)?[0-9]{10}$/.test(data.phone.replace(/[\s-]/g, ''))) errors.phone = 'Enter a 10-digit phone number for the demo.';
  if (!data.age) errors.age = 'Choose an age between 4 and 18.';
  if (method === 'card') {
    if (data.card.replace(/\s/g, '') !== '4242424242424242') errors.card = 'Use the test card 4242 4242 4242 4242.';
    const match = data.expiry.match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/);
    const today = new Date();
    const expired = match && new Date(2000 + Number(match[2]), Number(match[1]), 1) <= today;
    if (!match || expired) errors.expiry = 'Enter a future expiry in MM/YY format.';
    if (!/^\d{3}$/.test(data.cvc)) errors.cvc = 'Enter any 3 test digits.';
  } else if (data.upi.toLowerCase() !== 'parent@demo') {
    errors.upi = 'Use the demo UPI ID parent@demo.';
  }
  return errors;
}

export function Checkout({ signedIn }) {
  const [method, setMethod] = useState('card');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  function submit(event) {
    event.preventDefault();
    const next = validateCheckout(Object.fromEntries(new FormData(event.currentTarget)), method);
    setErrors(next);
    if (!Object.keys(next).length) {
      setSuccess(true);
      requestAnimationFrame(() => document.getElementById('trial-started')?.focus());
    } else {
      const field = event.currentTarget.elements.namedItem(Object.keys(next)[0]);
      field?.focus();
    }
  }

  const testExpiry = '12/' + String(new Date().getFullYear() + 2).slice(-2);
  return <main className="shell secondary-page" id="main">
    {success ? <section className="form-panel trial-success"><span className="feature-icon"><Check size={26} /></span><h1 id="trial-started" tabIndex={-1}>Trial started</h1>
      <p>Your 7-day trial has started. You will be charged ₹369 a month from day 8 unless you cancel.</p><p className="demo-note">This is a demo confirmation. No subscription or charge was created.</p><Link className="button primary" to="/#guidance" state={{ focus: 'chat-input' }}>Back to the chat</Link>
    </section> : <>
      <Link className="back-link" to="/">Back to Bridge</Link>
      <h1>Start your free trial</h1>
      <div className="checkout-grid">
        <form className="form-panel form-stack" onSubmit={submit} noValidate>
          <h2>Parent details</h2>
          <div className="form-two">
            <Input name="name" label="Parent name" errors={errors} defaultValue={signedIn ? 'Demo Parent' : ''} placeholder="Demo Parent" maxLength={100} required />
            <Input name="email" label="Email" errors={errors} type="email" defaultValue={signedIn ? demoEmail : ''} placeholder={demoEmail} maxLength={160} required />
            <Input name="phone" label="Phone" errors={errors} type="tel" placeholder="9999999999" maxLength={20} required />
            <div className="form-field"><label htmlFor="age">Child’s age</label><span className="select-wrap"><select id="age" name="age" defaultValue="" aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? 'age-error' : undefined} required><option value="" disabled>Choose age</option>{Array.from({ length: 15 }, (_, index) => <option key={index}>{index + 4}</option>)}</select><ChevronDown size={16} /></span>{errors.age && <small className="form-error" id="age-error">{errors.age}</small>}</div>
          </div>
          <div className="form-divider" />
          <h2>Mock payment</h2><p className="demo-note">Demo only. No real payment is taken.</p>
          <fieldset className="payment-switch"><legend className="sr-only">Payment method</legend>
            <label><input type="radio" name="method" checked={method === 'card'} onChange={() => setMethod('card')} /><CreditCard size={17} /> Test card</label>
            <label><input type="radio" name="method" checked={method === 'upi'} onChange={() => setMethod('upi')} /><Smartphone size={17} /> Mock UPI</label>
          </fieldset>
          {method === 'card' ? <div className="form-stack">
            <Input name="card" label="Test card number" errors={errors} defaultValue="4242 4242 4242 4242" inputMode="numeric" autoComplete="off" maxLength={19} required />
            <div className="form-two">
              <Input name="expiry" label="Test expiry" errors={errors} defaultValue={testExpiry} maxLength={7} autoComplete="off" required />
              <Input name="cvc" label="Test CVC" errors={errors} defaultValue="123" inputMode="numeric" autoComplete="off" maxLength={3} required />
            </div>
          </div> : <Input name="upi" label="Demo UPI ID" errors={errors} defaultValue="parent@demo" autoComplete="off" maxLength={30} required />}
          <button className="button primary">Start my free trial</button>
        </form>
        <aside className="form-panel trial-summary"><span className="feature-icon"><CalendarDays size={24} /></span><h2>7-day free trial</h2><p className="today-price">Today: ₹0</p><p>From day 8: ₹369 a month</p><p>Cancel anytime before the trial ends.</p></aside>
      </div>
    </>}
  </main>;
}

export function Policy({ terms = false }) {
  return <main className="shell secondary-page policy-page" id="main">
    <Link className="back-link" to="/">Back to Bridge</Link>
    <h1>{terms ? 'Terms' : 'Privacy'}</h1>
    <p className="demo-note">Sample text, to be reviewed by legal before launch.</p>
    {terms ? <>
      <h2>Using Bridge</h2><p>Bridge shares general parenting guidance. It is not medical advice or a diagnosis. Bridge is not an emergency service. In immediate danger, call <EmergencyLink /> in India. For non-emergency mental health support, call <TeleManas />.</p>
      <h2>Trial, billing and sessions</h2><p>The example plan is ₹0 for 7 days, then ₹369 a month. Cancel anytime before the trial ends to avoid the first charge. Psychologist sessions are listed at ₹599. All charges and appointments in this demo are simulated.</p>
      <h2>Acceptable use</h2><p>Use Bridge for lawful parenting questions. Avoid entering identifying information or sharing someone else’s confidential details.</p>
      <h2>Limitation of liability</h2><p>Exercise your own judgment and get professional help for individual concerns. Any limits on liability must comply with applicable law and are subject to legal review before launch.</p>
    </> : <>
      <h2>What information Bridge uses</h2><p>A live service would use account details to manage your account, chat messages to generate replies, and booking details to arrange appointments. In this demo, only the demo login flag and motion setting persist in your browser. Demo checkout, contact and booking details stay in the page.</p>
      <h2>Chat and children’s information</h2><p>Bridge is for parents and caregivers. Information about children should only come from their parent or caregiver. If live chat is enabled, messages are sent to Gemini to generate a reply. Leave out names, school names and other identifying information.</p>
      <h2>Protection and deletion</h2><p>The demo makes chat requests over the site connection and does not store chat history on the server. You can clear your browser’s site data to delete local preferences. For a live service, data access and deletion requests would be handled through support.</p>
    </>}
    <Link className="button secondary" to="/contact">Contact Bridge</Link>
  </main>;
}

export function Contact() {
  const [success, setSuccess] = useState(false);
  return <main className="shell secondary-page" id="main">
    <Link className="back-link" to="/">Back to Bridge</Link><h1>Contact</h1>
    <div className="checkout-grid">
      <form className="form-panel form-stack" onSubmit={event => { event.preventDefault(); setSuccess(true); event.currentTarget.reset(); }} onInput={() => setSuccess(false)}>
        <h2>Send a message</h2>
        <div className="form-two"><label>Name<input name="name" required maxLength={100} /></label><label>Email<input name="email" type="email" required maxLength={160} /></label></div>
        <label>Subject<input name="subject" required maxLength={140} /></label>
        <label>Message<textarea name="message" required rows={5} maxLength={1800} /></label>
        <button className="button primary">Send</button>
        {success && <p className="demo-note" role="status">Demo message submitted. No message was sent.</p>}
      </form>
      <aside className="form-panel trial-summary"><h2>Support</h2><p>Placeholder email<br /><strong>support@bridge.example</strong></p><p>Emergency in India<br /><EmergencyLink>Call 112</EmergencyLink></p><p>Mental health support<br /><TeleManas /></p></aside>
    </div>
  </main>;
}
