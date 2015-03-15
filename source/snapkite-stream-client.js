var streamConfig = {
  hostname: 'localhost',
  port: 3000,
  delayInMilliseconds: 1500,
  cacheNumberOfTweets: 20
};

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
  var MAXIMUM_NUMBER_OF_TWEETS = streamConfig.cacheNumberOfTweets;

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

function initialiseStream(handleNewTweet, config) {

  if (typeof config !== 'undefined') {
    if (typeof config.hostname !== 'undefined') {
      streamConfig.hostname = config.hostname;
    }

    if (typeof config.port !== 'undefined') {
      streamConfig.port = config.port;
    }

    if (typeof config.delayInMilliseconds !== 'undefined') {
      streamConfig.delayInMilliseconds = config.delayInMilliseconds;
    }

    if (typeof config.cacheNumberOfTweets !== 'undefined') {
      streamConfig.cacheNumberOfTweets = config.cacheNumberOfTweets;
    }
  }

  var socket = require('socket.io-client')('http://' + config.hostname + ':' + config.port);
  var tweetsQueue = new TweetsQueue();

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
    var tweet = tweetsQueue.dequeue();

    if (tweet) {
      handleNewTweet(tweet);
    }

  }, config.delayInMilliseconds);
}

module.exports = {
  initialiseStream: initialiseStream
};