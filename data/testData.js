function loadTestData() {
    const sampleData = [];
    const sampleDataSize = 20;
    for (let i = 0; i < sampleDataSize; i++) {
      const message = getRandomString({
        length: getRandomInteger({min: 10, max: 150}),
        includeSpaces: true
      });
      const firstName = getRandomString({
        length: getRandomInteger({min: 3, max: 7}),
        includeSpaces: false
      });
      const lastName = getRandomString({
        length: getRandomInteger({min: 3, max: 7}),
        includeSpaces: false
      });
      const handle = '@' + getRandomString({
        length: getRandomInteger({min: 4, max: 8}),
        includeSpaces: false
      });
      sampleData.push({
        tweet: {
          name: `${firstName} ${lastName}`,
          message, handle
        }
      });
    }
    for (const data of sampleData) {
      // Do nothing with result
      api.post(HOST + 'tweets', data, () => {});
    }
  }

  function getRandomString({length}) { 
    const characterChoices = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "; 
    const characters = [];
    while (characters.length < length) {
      const randomIndex = Math.floor(Math.random() * characterChoices.length);
      characters.push(characterChoices[randomIndex]);
    }
    return characters.join('');
  }
  
  function getRandomInteger({min, max}) {
    return Math.floor((Math.random() + min) * (max - min));
  }