const constant = require('./constant/define');
const error = require('./error/define');

const future = require('./future/define');
const spot = require('./spot/define');
const http = require('./http/define');
const time = require('./time/define');
const loop = require('./loop/define');
const promise = require('./promise/define');

module.exports = {
  constant,
  promise,
  error,
  future,
  loop,
  spot,
  http,
  time,
};
