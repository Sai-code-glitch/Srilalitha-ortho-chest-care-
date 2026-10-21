# Sri Lalitha Orthopaedic & Chest Care

Website for **Sri Lalitha Orthopaedic & Chest Care**, Tenali, Andhra Pradesh.

- **Dr. Talasila Rakesh**, M.B.B.S., M.S. (Orthopaedics), Trauma & Joint Replacement Surgeon (Reg. No. 79178)
- **Dr. Kavya Yalamanchili**, M.B.B.S., M.D. (Pulmonary Medicine), Consultant Pulmonologist (Reg. No. 95739)

Live site: https://sai-code-glitch.github.io/Srilalitha-ortho-chest-care-/

## Features

- Guided conversations with each doctor, with notes the patient can bring to the visit
- Body map symptom explorer: tap an area, tick symptoms, see likely conditions ranked live
- Live open/closed status for both OPDs, radiology, pharmacy and weekend online consultation
- Four-step booking for hospital visits or online video consultations, sent to the front desk on WhatsApp, with "add to calendar"
- In-house radiology and pharmacy pages, with WhatsApp shortcuts for X-ray booking and prescription checks
- Health checks: asthma control, COPD risk, knee pain score, BMI and joint load, medicine reminders, fracture first aid
- Exercise library with guided timers (knee, back, neck, shoulder, lungs) and a guided breathing exercise
- Health library articles
- English / Telugu switch, larger-text mode, light and dark themes
- Installable as an app (PWA, works offline), SEO and Google-ready clinic data

## Editing

| What | Where |
| --- | --- |
| Phone and WhatsApp numbers | `assets/js/data.js` → `SL.CONFIG` |
| Exercises, articles, Telugu text | `assets/js/data.js` |
| Doctor chat scripts, body map conditions, timings | `assets/js/app.js` (`N`, `AREAS`, `HRS`) |
| Styles | `assets/css/style.css` |
| Logo files | `assets/img/` |

No build step. Any change pushed to `main` is published by GitHub Pages.

## Still to confirm

- Street address (currently a placeholder)
- Which number receives WhatsApp bookings (`SL.CONFIG.whatsapp`)
- Doctor photos
- Medical content review by both doctors

Guidance on this site does not replace a consultation.
