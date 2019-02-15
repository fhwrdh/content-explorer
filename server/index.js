const path = require('path');
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const { buildTranslations } = require('./translations');
const { debug } = require('./utils');

const PORT = process.env.PORT || 4000;

const start = async () => {
  debug('Gathering data...');
  const translations = await buildTranslations(axios.get);
  debug('translations.length: ', translations.translations.length);

  const app = express();
  app.use(morgan('tiny'));
  app.use('/ok', (req, res) => res.sendStatus(200));
  app.use('/translations', (req, res) => res.send(translations));
  app.use(express.static(path.join(__dirname, '..', 'build')));

  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

start();
