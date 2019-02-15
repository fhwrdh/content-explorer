const path = require('path');
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const { buildTranslations } = require('./translations');
const { debug } = require('./utils');

const PORT = process.env.PORT || 4000;

let lastUpdate;
let translations;

const start = async () => {
  debug('Gathering data...');
  translations = await buildTranslations(axios.get);
  lastUpdate = Date.now();
  debug('translations.length: ', translations.translations.length);

  const app = express();
  app.use(
    morgan('tiny', {
      skip: req => /^\/static\//.test(req.url),
    })
  );
  app.use('/ok', (req, res) => res.sendStatus(200));
  app.use('/translations', (req, res) =>
    res.send({ lastUpdate, ...translations })
  );
  app.use('/refresh', async (req, res) => {
    translations = await buildTranslations(axios.get);
    lastUpdate = Date.now();
    res.send({ lastUpdate, ...translations });
  });
  app.use('/lastupdate', (req, res) => res.send({ lastUpdate }));
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

start();
