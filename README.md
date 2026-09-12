# Signup Wizard Assessment

## Run locally

```bash
npm install
npm run dev
```

Then open the localhost URL shown by Vite.

## Flow

Landing → Terms & Conditions → Email → OTP → Profile → Location → Success.

The app is frontend-only and uses simulated verification/submission delays.

## Demo checklist

Show:
- responsive landing page
- terms page
- invalid email
- OTP validation
- age below 18 validation
- required-field errors
- state → city dependency
- loading spinner
- back navigation
- successful completion
