import 'dotenv/config';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 8787);
const app = await createApp();

app.listen(port, () => {
  console.log(`AccessLens API listening on http://localhost:${port}`);
});
