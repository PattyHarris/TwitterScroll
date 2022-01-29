class Database {
    constructor() {
      this.tweets = [];
    }
  
    query({lastTweetId, pageSize}) {
      if (!lastTweetId) {
        return this.tweets.slice(0, pageSize);
      }
      for (let i = 0; i < this.tweets.length; i++) {
        const currentTweet = this.tweets[i];
        if (currentTweet.id === lastTweetId) {
          return this.tweets.slice(i + 1, i + 1 + pageSize);
        }
      }
      return [];
    }
  
    insert(tweet) {
      this.tweets.push({
        tweet,
        id: getRandomString({length: 50}),
        timestamp: (new Date()).getTime()
      });
    }
  }

const database = new Database();

function getTweetsHandler(data) {
  const pageSize = data.pageSize;
  const sortOrder = data.sortOrder;
  const lastTweetId = data.lastTweetId;

  if (sortOrder !== 'recent') {
    throw new Error('I dont know how to handle that');
  }

  return database.query({lastTweetId, pageSize});
}

function postTweetHandler(data) {
  database.insert(data.tweet);
}

const endpoints = {
  "/tweets": {
    "get": getTweetsHandler,
    "post": postTweetHandler
  }
}