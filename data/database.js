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