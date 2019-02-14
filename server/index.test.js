const { buildTranslations } = require('./translations');

describe('server', () => {
  it('should return translations', async () => {
    const translations = await buildTranslations(url => {
      const lang = url.match(/l=(..)&/)[1];
      return Promise.resolve({
        data: {
          [`key0`]: `${lang}0Val`,
          [`key1`]: `${lang}1Val`,
        },
      });
    });
    // console.log('test.translations: ', translations);
    expect(translations.translations).toEqual([
      { key: 'key0', de: 'de0Val', en: 'en0Val', es: 'es0Val', zh: 'zh0Val' },
      { key: 'key1', de: 'de1Val', en: 'en1Val', es: 'es1Val', zh: 'zh1Val' },
    ]);
  });
});
