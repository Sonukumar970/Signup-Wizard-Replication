import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialForm = {
  email: '',
  otp: '',
  firstName: '',
  lastName: '',
  age: '',
  pronouns: '',
  state: '',
  city: ''
};

const cities = {
  Delhi: ['New Delhi', 'Dwarka', 'Rohini'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru'],
  WestBengal: ['Kolkata', 'Howrah', 'Durgapur']
};

function App() {
  const [screen, setScreen] = useState('landing');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCities = useMemo(() => cities[form.state] || [], [form.state]);

  const update = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (currentStep = step) => {
    const e = {};

    if (currentStep === 1) {
      if (!form.email.trim()) e.email = 'Email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = 'Please enter a valid email address.';
    }

    if (currentStep === 2) {
      if (!/^\d{6}$/.test(form.otp)) e.otp = 'Enter the 6-digit verification code.';
    }

    if (currentStep === 3) {
      if (!form.firstName.trim()) e.firstName = 'First name is required.';
      if (!form.lastName.trim()) e.lastName = 'Last name is required.';
      if (!form.age) e.age = 'Age is required.';
      else if (!/^\d+$/.test(form.age)) e.age = 'Age must contain numbers only.';
      else if (Number(form.age) < 18) e.age = 'You must be at least 18 years old.';
      else if (Number(form.age) > 100) e.age = 'Please enter a valid age.';
      if (!form.pronouns) e.pronouns = 'Please select your pronouns.';
    }

    if (currentStep === 4) {
      if (!form.state) e.state = 'Please select a state.';
      if (!form.city) e.city = 'Please select a city.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) {
      setToast('Please fix the highlighted fields.');
      return;
    }

    if (step === 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(2);
      }, 700);
      return;
    }

    if (step < 4) setStep(step + 1);
    else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setScreen('success');
      }, 1000);
    }
  };

  const back = () => {
    if (step === 1) setScreen('terms');
    else setStep(step - 1);
  };

  const start = () => {
    setScreen('terms');
    setToast('');
  };

  const acceptTerms = () => {
    setScreen('wizard');
    setStep(1);
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
    setStep(1);
    setScreen('landing');
  };

  return (
    <main className="app-shell">
      {toast && <div className="toast" role="alert">{toast}<button onClick={() => setToast('')}>×</button></div>}

      {screen === 'landing' && (
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="brand">NUBPACK</div>
            <p className="eyebrow">WELCOME</p>
            <h1>Create your profile</h1>
            <p className="hero-copy">
              Join the community and create your profile in a few simple steps.
            </p>
            <button className="primary large" onClick={start}>Get Started</button>
          </div>
        </section>
      )}

      {screen === 'terms' && (
        <section className="center-page">
          <div className="card terms-card">
            <button className="back-link" onClick={() => setScreen('landing')}>← Back</button>
            <div className="brand dark">NUBPACK</div>
            <h1>Terms & Conditions</h1>
            <p className="muted">Please review the terms before creating your profile.</p>
            <div className="terms-scroll">
              <h3>1. Acceptance</h3>
              <p>By continuing, you agree to use this service responsibly and provide accurate information.</p>
              <h3>2. Account information</h3>
              <p>You are responsible for keeping the information associated with your profile accurate and up to date.</p>
              <h3>3. Privacy</h3>
              <p>Your information should be handled according to the application's privacy practices.</p>
              <h3>4. Eligibility</h3>
              <p>You must meet the minimum age requirement to complete the profile.</p>
            </div>
            <button className="primary" onClick={acceptTerms}>I Agree & Continue</button>
          </div>
        </section>
      )}

      {screen === 'wizard' && (
        <section className="center-page">
          <div className="card wizard-card">
            <div className="wizard-header">
              <button className="back-link" onClick={back}>← Back</button>
              <span>Step {step} of 4</span>
            </div>

            <div className="progress">
              {[1,2,3,4].map(n => <span key={n} className={n <= step ? 'active' : ''} />)}
            </div>

            {step === 1 && <StepEmail form={form} update={update} error={errors.email} />}
            {step === 2 && <StepOtp form={form} update={update} error={errors.otp} />}
            {step === 3 && <StepProfile form={form} update={update} errors={errors} />}
            {step === 4 && <StepLocation form={form} update={update} errors={errors} cities={selectedCities} />}

            <button className="primary submit" onClick={next} disabled={loading}>
              {loading ? <><span className="spinner" /> Processing...</> : step === 4 ? 'Complete Profile' : 'Continue'}
            </button>
          </div>
        </section>
      )}

      {screen === 'success' && (
        <section className="center-page">
          <div className="card success-card">
            <div className="success-icon">✓</div>
            <div className="brand dark">NUBPACK</div>
            <h1>Profile completed!</h1>
            <p className="muted">Your signup has been completed successfully.</p>
            <button className="primary" onClick={reset}>Back to Home</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Field({ label, error, children }) {
  return <label className="field"><span>{label}</span>{children}{error && <small className="error">{error}</small>}</label>;
}

function StepEmail({ form, update, error }) {
  return <>
    <p className="eyebrow">SIGN UP</p>
    <h1>What's your email?</h1>
    <p className="muted">We'll use your email to verify your account.</p>
    <Field label="Email address" error={error}>
      <input type="email" value={form.email} maxLength={100}
        onChange={e => update('email', e.target.value)}
        placeholder="you@example.com" autoComplete="email" />
    </Field>
  </>;
}

function StepOtp({ form, update, error }) {
  return <>
    <p className="eyebrow">VERIFY</p>
    <h1>Enter verification code</h1>
    <p className="muted">For this frontend assessment, use any 6-digit code.</p>
    <Field label="6-digit code" error={error}>
      <input inputMode="numeric" value={form.otp} maxLength={6}
        onChange={e => update('otp', e.target.value.replace(/\D/g, ''))}
        placeholder="000000" />
    </Field>
    <button className="text-button" type="button">Resend code</button>
  </>;
}

function StepProfile({ form, update, errors }) {
  return <>
    <p className="eyebrow">ABOUT YOU</p>
    <h1>Tell us about yourself</h1>
    <p className="muted">These details help personalize your profile.</p>
    <div className="two-col">
      <Field label="First name" error={errors.firstName}>
        <input value={form.firstName} maxLength={40} onChange={e => update('firstName', e.target.value)} />
      </Field>
      <Field label="Last name" error={errors.lastName}>
        <input value={form.lastName} maxLength={40} onChange={e => update('lastName', e.target.value)} />
      </Field>
    </div>
    <Field label="Age" error={errors.age}>
      <input inputMode="numeric" value={form.age} maxLength={3}
        onChange={e => update('age', e.target.value.replace(/\D/g, ''))}
        placeholder="18+" />
    </Field>
    <Field label="Pronouns" error={errors.pronouns}>
      <select value={form.pronouns} onChange={e => update('pronouns', e.target.value)}>
        <option value="">Select pronouns</option>
        <option>He / Him</option>
        <option>She / Her</option>
        <option>They / Them</option>
        <option>Prefer not to say</option>
      </select>
    </Field>
  </>;
}

function StepLocation({ form, update, errors, cities }) {
  return <>
    <p className="eyebrow">LOCATION</p>
    <h1>Where are you based?</h1>
    <p className="muted">Select a state first to see available cities.</p>
    <Field label="State" error={errors.state}>
      <select value={form.state} onChange={e => { update('state', e.target.value); update('city', ''); }}>
        <option value="">Select state</option>
        <option value="Delhi">Delhi</option>
        <option value="Maharashtra">Maharashtra</option>
        <option value="Karnataka">Karnataka</option>
        <option value="WestBengal">West Bengal</option>
      </select>
    </Field>
    <Field label="City" error={errors.city}>
      <select value={form.city} disabled={!form.state} onChange={e => update('city', e.target.value)}>
        <option value="">Select city</option>
        {cities.map(city => <option key={city}>{city}</option>)}
      </select>
    </Field>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
