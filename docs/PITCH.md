# Pitch and submission pack

## One-line pitch

**AccessLens turns one venue photo into evidence-linked accessibility fixes that a small business can prioritize, track, and verify.**

## 30-second pitch

Small venues want to be welcoming, but accessibility checklists are abstract and professional audits can feel like a later step. AccessLens makes the first step concrete. Take one photo: Gemini identifies only the barriers it can visibly support, marks the evidence, explains who is affected, and ranks practical fixes by cost, effort, and impact. Complete a fix and the score changes. It is multilingual, explicit about uncertainty, and works offline for the demo—because AI should guide a better inspection, not pretend to certify one.

## Three-minute pitch structure

### 0:00–0:30 — Problem

“This entrance looks ordinary. But to a wheelchair user, older adult, or someone with low vision, it contains several different barriers. Small venue owners often want to improve access but don’t know what to inspect first.”

### 0:30–0:55 — Insight

“A chatbot cannot see the space, and a black-box score is not trustworthy. The useful AI role is evidence-linked decision support: show the barrier, state confidence, explain who is affected, and suggest the next action.”

### 0:55–2:10 — Live demo

1. Click **Audit a space**.
2. Point out **Synthetic demo scene**.
3. Click **Analyze with Gemini**.
4. On results: “42 today; 82 possible after this plan.”
5. Click evidence marker 1 and read one sentence of visible evidence.
6. Show ranked cost/effort actions.
7. Complete “Clear the entrance path”; show score **42 → 50**.
8. Toggle **हिन्दी** and point to the impact-method disclosure.

### 2:10–2:40 — Technical proof

“The React client sends the photo and venue context to our Express API. Gemini 3.5 Flash-Lite receives a bounded screening prompt and a JSON schema, so it returns typed barriers, confidence, image regions, and fixes—not free-form chat. MongoDB persists audits when configured. No key or network? The exact same UI switches to a clearly labeled deterministic fixture.”

### 2:40–3:00 — Close

“AccessLens does not replace an accessibility professional. It helps small venues reach that conversation with evidence and a first action already completed. See barriers. Ship fixes.”

## Slide deck outline

1. **Title:** AccessLens — See barriers. Ship fixes.
2. **Problem:** ordinary entrances hide multiple access barriers; first step is unclear.
3. **User:** small venue managers and campus/community organizers.
4. **Insight:** evidence-linked screening is more useful and trustworthy than chat or a black-box score.
5. **Solution:** photo → visible findings → ranked actions → tracked outcome.
6. **Live product:** screenshots of setup, annotated result, and score change.
7. **Why Gemini:** multimodal understanding + structured reasoning + plain-language bilingual output.
8. **Architecture:** React → Express → Gemini schema → MongoDB/memory → action analytics.
9. **Impact and honesty:** barriers, fixes, score delta, labeled reach estimate, human verification.
10. **Next:** expert validation, calibrated rubric, consented dataset, multi-image audits.

Keep each slide to one claim. Use the live product as the centerpiece, not a feature list.

## Devpost submission text

### Project title

AccessLens

### Tagline

See barriers. Ship fixes.

### Short description

AccessLens uses Google Gemini’s multimodal reasoning to turn one venue photo into evidence-linked accessibility findings, a prioritized action plan, and measurable score improvements—without pretending to replace a professional audit.

### Inspiration

Many small shops, clinics, cafés, and community spaces want to be welcoming but do not know what to inspect first. Accessibility checklists can feel abstract, while a professional audit is most useful when the owner is ready with context and questions. We wanted to make that first step visible and actionable.

### What it does

Users choose a labeled synthetic demo photo or upload a real venue image, then add simple venue context. AccessLens:

- marks visible accessibility barriers directly on the image;
- explains the evidence, affected users, severity, and model confidence;
- ranks practical fixes by priority, cost band, effort, and score impact;
- tracks completed actions and updates the accessibility score;
- provides a plain-language Hindi summary;
- shows how outcome estimates are calculated;
- falls back to a clearly labeled offline demo if the API or internet is unavailable.

AccessLens is AI-assisted screening, not legal certification. Dimensions and compliance must be verified on site by a qualified person.

### How we built it

The product is a React/Vite frontend with a Node/Express API and an optional MongoDB/Mongoose persistence layer. The API sends image bytes and venue context to Gemini 3.5 Flash-Lite. A strict JSON schema asks Gemini for evidence-grounded barriers, normalized image regions, confidence, bilingual summary, and ranked fixes. The UI renders that output as an interactive evidence overlay and action plan. Multer validates image type/size, and Vitest/Supertest cover the full create-audit and score-update API flow.

### How Gemini is essential

Gemini performs the product’s core transformation: multimodal understanding of the physical scene plus structured, context-aware prioritization. The workflow cannot be reproduced by a text-only chatbot or static checklist. Gemini’s output is bounded and inspectable: every finding needs visible evidence, a confidence value, affected-user explanation, and a precise JSON shape.

### Challenges

The central design challenge was honesty. A single photo cannot prove dimensions or certify compliance. We therefore constrained the prompt, attached confidence to findings, separated visible evidence from inference, exposed the analysis mode, labeled every synthetic/estimated value, and inserted a human-verification checkpoint. We also built a deterministic fallback so a network outage never forces us to fake a live result.

### Accomplishments

- working end-to-end photo-to-action flow;
- evidence annotations and confidence rather than unsupported chat output;
- action completion that updates the score in real time;
- mobile-responsive and printable result experience;
- loading, error, empty, onboarding, live, and demo states;
- tested API integration and offline judging flow.

### What we learned

The best AI UX does not hide uncertainty. Showing why a model made a claim—and what a human must verify—can be more valuable than adding more autonomous features.

### What’s next

We would partner with disabled users and qualified accessibility professionals to calibrate the rubric, add consented real-world evaluation images, support multi-image venue audits, add Marathi output, and build a human-reviewed export for professional follow-up.

### Built with

Google Gemini API, Google GenAI SDK, React, Vite, Node.js, Express, MongoDB, Mongoose, Multer, Vitest, Supertest, and Lucide.

## Anticipated judge Q&A

### “Is a photo enough to assess accessibility?”

No. It is enough for a conservative first-pass **visual screening**. The UI explicitly says it is not certification, does not infer invisible dimensions, and sends users to on-site verification for structural fixes.

### “Why is Gemini necessary?”

The core input is an unstructured physical scene. Gemini connects visual elements to affected users, severity, practical remediation, bilingual explanation, and structured regions in one bounded multimodal call. A static checklist would not adapt to the actual space.

### “How do you know the findings are correct?”

We require visible evidence and confidence per finding, cap the number of outputs, and keep a human checkpoint. The next research step is a consented expert-labeled evaluation set measuring per-category precision and recall.

### “Where did the 96 people-per-month number come from?”

It is deliberately labeled illustrative: monthly visitors × 8%. We expose that formula instead of presenting it as observed fact. A real deployment would replace it with venue data and a validated impact model.

### “Is the demo result generated live?”

If `GEMINI_API_KEY` is configured, yes, and the UI says `Live`. Without a key or during an outage, it uses a deterministic fixture and says so. We never present fallback data as a live model response.

### “What prevents prompt injection in signs inside the photo?”

The server prompt explicitly treats all image text as untrusted scene content, never instructions. The model only returns a strict JSON schema; the API key remains server-side; and user content is not executed.

### “Why not add authentication, maps, or a contractor marketplace?”

They do not strengthen the core judging proof. We prioritized the complete evidence-to-action loop, resilience, and trust. Those features become useful after expert validation.

### “What is novel compared with an accessibility checklist?”

The evidence loop: users see exactly where a claim came from, who it affects, how confident the model is, which fix comes first, and how completing it changes the outcome. It turns a generic checklist into a contextual decision surface.

### “What data is real?”

The product code and interaction are real. The bundled venue image, findings, and reach estimate are synthetic/illustrative and labeled. User uploads can be analyzed through the live Gemini route.

### “How would you deploy this responsibly?”

Short retention, consent, secure object storage, authentication, rate limits, deletion controls, prompt/model versioning, expert rubric calibration, accessibility testing with disabled users, and a human-reviewed export. Public venue rankings would remain out of scope.
