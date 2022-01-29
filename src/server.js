const HOST = 'server.com/';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT_ORDER = 'recent';

const States = {
  PENDING: 'pending',
  READY: 'ready',
  BACKOFF: 'backoff'
};

//=====================
let componentState = States.READY;

function isComponentPending() {
  return componentState === States.PENDING;
}

function setPending() {
  componentState = States.PENDING;
  document.body.appendChild(loadingElement);
}

function setReady() {
  componentState = States.READY;
  document.body.removeChild(loadingElement);
}

function setBackoff() {
  componentState = States.BACKOFF;
  document.body.removeChild(loadingElement);
}

//=====================

let lastTweetId = null;

function onNewTweets(data) {
  if (data.length <= 1) {
      setBackoff();
      setTimeout(() => setReady(), 2000);
  } 
  else {
    setReady();
    let tweetsHTML = '';
    for (const tweetResponse of data) {
      const tweet = createTweet(tweetResponse.tweet);
      tweetsHTML += tweet;
      lastTweetId = tweetResponse.id;
    }
    document.body.innerHTML += tweetsHTML;
  }
}

//=====================
function createTweet({name, handle, message}) {
  const template = `
  <div class="tweet">
  <div class="tweetColumn avatar">
    <img class="avatarImage" src="images/dog.jpeg" />
  </div>
  <div class="tweetColumn tweetMain">
    <div class="tweetMainHeader">
      <div class="tweetMainHeaderItem tweetMainHeaderItemName">
        ${name}
      </div>
      <div class="tweetMainHeaderItem tweetMainHeaderItemBadge">
        <img class="tweetIcon tweetMainHeaderItemBadge" src="images/footer_icon.svg">
      </div>
      <div class="tweetMainHeaderItem tweetMainHeaderItemHandle">
        @${handle}
      </div>
      <div class="tweetMainHeaderItem tweetMainHeaderItemDuration">
        7h
      </div>
    </div>
    <div class="tweetMainMessage">
    ${message}
    </div>
    <div class="tweetFooter">
      <div class="tweetFooterStats">
        <img class="tweetIcon tweetFooterStatsItem" src="images/footer_icon.svg" />
        <div class="tweetFooterStatsItem">
          10
        </div>
      </div>
      <div class="tweetFooterStats">
        <img class="tweetIcon tweetFooterStatsItem" src="images/footer_icon.svg" />
        <div class="tweetFooterStatsItem">
          900
        </div>
      </div>
      <div class="tweetFooterStats">
        <img class="tweetIcon tweetFooterStatsItem" src="images/footer_icon.svg" />
        <div class="tweetFooterStatsItem">
          1.1K
        </div>
      </div>
      <div class="tweetFooterStats">
        <img class="tweetIcon tweetFooterStatsItem" src="images/footer_icon.svg" />
      </div>
    </div>
  </div>
  <div class="tweetMenu">
    <img class="tweetIcon tweetMenuIcon" src="images/down_icon.svg">
  </div>
</div>
  `;
  return template;
}

//=====================
// API library

function getFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"));
  const endpoint = url.substring(url.indexOf("/"), url.length);

  setTimeout(() => callback(endpoints[endpoint]["get"](data)), 2000);
}

function postFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"));
  const endpoint = url.substring(url.indexOf("/"), url.length);

  setTimeout(() => callback(endpoints[endpoint]["post"](data)), 2000);
}

const api = {
  get: getFunction,
  post: postFunction
};

//=====================
// Retrieve tweets.

function hydrate() {
  const params = {
    pageSize: DEFAULT_PAGE_SIZE,
    sortOrder: DEFAULT_SORT_ORDER
  }
  api.get(HOST + 'tweets', params, onNewTweets);
  setPending();
}

//=====================
let loadingElement = null;

document.addEventListener('DOMContentLoaded', (event) =>  {

  loadingElement = document.createElement('div');

  // Give it the same style
  loadingElement.classList.add('tweet');
  loadingElement.innerHTML = `
    Here I am... Loading...
    <img class="loading__image" src="images/dog.jpeg" />
  `;

  document.body.appendChild(loadingElement);

  loadTestData();
  hydrate();
})

//=====================
function onScroll(event) {
  if (isComponentPending()) {
    return;
  }

  const scrolledTo = window.innerHeight + window.pageYOffset;
  const scrollLimit = document.body.offsetHeight;
  const scrollThreshold = 30;

  if (scrollLimit - scrolledTo <= scrollThreshold && componentState != 'backoff') {
    const params = {
      pageSize: DEFAULT_PAGE_SIZE,
      sortOrder: DEFAULT_SORT_ORDER,
      lastTweetId
    }
    api.get(HOST + 'tweets', params, onNewTweets);
    setPending();
  }
}

//=====================
window.addEventListener('scroll', onScroll);
