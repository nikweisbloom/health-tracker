import express from 'express';
import path from 'node:path';
// import mongoose from 'mongoose';

import db from './config/connection';
import routes from './routes/index';

await db();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

   app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// http://127.0.0.1:3001/
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});
