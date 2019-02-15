const R = require('ramda');
const { debug, mapIndex } = require('./utils');

const contentUrl = 'http://members.cj.com/member/content.json';
const languages = R.sort(R.comparator(R.lt))([
  'cs',
  'de',
  'en',
  'es',
  'fr',
  'ja',
  'pl',
  'pt',
  'zh',
]);
debug('languages: ', languages);

const getContentWith = getter => async language => {
  debug(`getting content: ${language}`);
  const response = await getter(`${contentUrl}?l=${language}&p`);
  debug(`returning data for ${language}: ${response.status}`);
  return response.data;
};

const buildTranslations = async getter => {
  const getContent = getContentWith(getter);
  const translationsArray = await Promise.all(R.map(getContent)(languages));
  const langToTranslationsMap = R.fromPairs(
    R.zip(languages, translationsArray)
  );
  // {
  //   {
  //    'en': { key0: 'enVal0', key1: 'enVal1', ...}
  //   },
  //   {
  //    'de': { key0: 'deVal0', key1: 'deVal1', ...}
  //   }
  //  }
  const allKeys = R.reduce(
    (acc, val) => R.union(acc, R.keys(val)),
    [],
    translationsArray
  );
  const sortedKeys = R.sort((a, b) => a.localeCompare(b))(allKeys);
  //
  //
  //   [
  //   {key: 'key0', de: 'german[key0]', ...}
  //   {key: 'key1', de: 'german[key1]', ...}
  //   ]

  const translations = mapIndex((k, i) => {
    const t = R.reduce(
      (acc, lang) => ({
        ...acc,
        [lang]: langToTranslationsMap[lang][k],
      }),
      {}
    )(languages);

    return {
      key: k,
      ...t,
    };
  })(sortedKeys);

  return {
    languages,
    translations,
  };
};

module.exports = {
  buildTranslations,
};
