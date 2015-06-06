var config = {
  hostname: 'localhost',
  port: 3000,
  delayInMilliseconds: 1500,
  cacheNumberOfTweets: 20
};

var socket;
var tweetsQueue;

function loadImage(url, callback) {
  var image = new Image();

  // If image already cached by web browser, then this callback will not fire.
  // This is very helpful, because it will help to avoid showing duplicate images to users.
  // http://stackoverflow.com/a/10404014
  image.onload = function () {
    callback();
  };
  image.src = url;
}

function TweetsQueue() {
  var tweets = [];
  var MAXIMUM_NUMBER_OF_TWEETS = config.cacheNumberOfTweets;

  this.enqueue = function (tweet) {
    if (this.getSize() < MAXIMUM_NUMBER_OF_TWEETS) {
      var tweetMediaUrl = tweet.media[0].url;

      loadImage(tweetMediaUrl, function () {
        tweets.push(tweet);
      });
    }
  };

  this.dequeue = function () {
    return tweets.shift();
  };

  this.getSize = function () {
    return tweets.length;
  };
}

function initializeStream(handleNewTweet, streamConfig) {

  if (typeof streamConfig !== 'undefined') {
    if (typeof streamConfig.hostname !== 'undefined') {
      config.hostname = streamConfig.hostname;
    }

    if (typeof streamConfig.port !== 'undefined') {
      config.port = streamConfig.port;
    }

    if (typeof streamConfig.delayInMilliseconds !== 'undefined') {
      config.delayInMilliseconds = streamConfig.delayInMilliseconds;
    }

    if (typeof streamConfig.cacheNumberOfTweets !== 'undefined') {
      config.cacheNumberOfTweets = streamConfig.cacheNumberOfTweets;
    }
  }

  socket = require('socket.io-client')('http://' + config.hostname + ':' + config.port);
  tweetsQueue = new TweetsQueue();

  socket.on('connect', function () {
    console.log('[Snapkite Stream Client] Socket connected');
  });

  socket.on('disconnect', function () {
    console.log('[Snapkite Stream Client] Socket disconnected');
  });

  socket.on('tweet', function (tweet) {
    tweetsQueue.enqueue(tweet);
  });

  window.setInterval(function () {
    if (! tweetsQueue) {
      return;
    }

    var tweet = tweetsQueue.dequeue();

    if (tweet) {
      handleNewTweet(tweet);
    }

  }, config.delayInMilliseconds);
}

function destroyStream() {
  socket.disconnect();
  tweetsQueue = null;
}

module.exports = {
  initializeStream: initializeStream,
  initialiseStream: initializeStream,
  destroyStream: destroyStream
};
