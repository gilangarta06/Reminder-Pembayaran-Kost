const express = require('express');
const next = require('next');
const { initCron } = require('./cron/worker');
const connect = require('./lib/mongoose');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

app.prepare().then(async () => {
  await connect();
  const server = express();
  server.use(express.json());
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    initCron();
  });
});
