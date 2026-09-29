import 'dotenv/config';
import { createApp } from '../server/app.js';

// Vercel keeps this Express application warm between requests when possible.
// Gemini credentials remain server-side in the deployment environment.
const app = await createApp();

export default app;
