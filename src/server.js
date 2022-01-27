const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_SORT_ORDER = 'recent';

const States = {
  PENDING: 'pending',
  READY: 'ready',
  BACKOFF: 'backoff'
};

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

let lastTweetId = null;

const loadingElement = document.createElement('div');
// Give it the same style
loadingElement.classList.add('tweet');
loadingElement.innerHTML = `
  Here I am... Loading...
  <img class="loading__image" src="images/dog.jpeg" />
`;

function onNewTweets(data) {
  if (data.length <= 1) {
      setBackoff();
      setTimeout(() => setReady(), 2000);
  } else {
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

function hydrate() {
  const params = {
    pageSize: DEFAULT_PAGE_SIZE,
    sortOrder: DEFAULT_SORT_ORDER
  }
  api.get(HOST + 'tweets', params, onNewTweets);
  setPending();
}

loadTestData();
hydrate();

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


const endpoints = {
  "/": {
    "get": () => "hello world"
  }
}

// API library

function getFunction(url, data, callback) {
  const domain = url.substring(0, url.indexOf("/"));
  const endpoint = url.substring(url.indexOf("/"), url.length);

  callback(endpoints[endpoint]["get"](data));
}

const api = {
  get: getFunction
};

window.addEventListener('scroll', onScroll);