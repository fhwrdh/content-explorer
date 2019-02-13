const app = require('express')();
const R = require('ramda');
const morgan = require('morgan');
const axios = require('axios');
const PORT = 4000;

const getData = async url => {
  const response = await axios.get(url);
  return response.data;
};

const getContent = async () => {
  console.log('Gathering data...');

  const data = {};
  data.en = await getData('http://members.cj.com/member/content.json?l=en&p');
  data.de = await getData('http://members.cj.com/member/content.json?l=de&p');
  data.zh = await getData('http://members.cj.com/member/content.json?l=zh&p');
  data.es = await getData('http://members.cj.com/member/content.json?l=es&p');

  const allKeys = R.union(R.keys(data.en), R.keys(data.de));
  const t = R.pipe(
    R.sort((a, b) => a.localeCompare(b)),
    R.map(key => ({
      key,
      en: data.en[key],
      de: data.de[key],
      zh: data.zh[key],
      es: data.es[key],
    }))
  )(allKeys);
  console.log('translations done');

  app.use(morgan('tiny'));
  app.use('/ok', (req, res) => res.sendStatus(200));
  app.use('/data', (req, res) => res.send(data));
  app.use('/translations', (req, res) => res.send(t));
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
};

getContent();
