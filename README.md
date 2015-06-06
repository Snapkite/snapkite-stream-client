# Snapkite Stream Client

This helper library handles stream of tweets sent using Socket.IO by [Snapkite Engine](https://github.com/snapkite/snapkite-engine).

## Install

```js
npm install --save snapkite-stream-client
```

## API

```js
var SnapkiteStreamClient = require('snapkite-stream-client');
```

### `initializeStream()` or `initialiseStream()`

Connects to [Snapkite Engine](https://github.com/snapkite/snapkite-engine) and invokes callback function on receiving new tweet:

```js
SnapkiteStreamClient.initializeStream(callback, options);
```

Callback function should handle tweet object:

```js
function callback(tweet) {
  // ... handle tweet object
}
```

#### `options` object:

```js
{
  hostname: 'localhost',
  port: 3000,
  delayInMilliseconds: 1500,
  cacheNumberOfTweets: 20
}
```

+ `hostname`

  Default: `localhost`.

+ `port`

  Default: `3000`.

+ `delayInMilliseconds`

  Tweets can arrive at a very fast pace, so to prevent that you can set the minimum delay between tweets. Delay is set in milliseconds.

  Default: `1500`

+ `cacheNumberOfTweets`

  If you set a delay between receiving new tweets, you might want to cache them. Tweets that are not cached will be dropped.

  Default: `20`

### `destroyStream()`

Disconnect from [Snapkite Engine](https://github.com/snapkite/snapkite-engine).

```javascript
SnapkiteStreamClient.destroyStream();
```

## License

This library is released under the MIT license.

This software comes with NO WARRANTY, expressed or implied.
