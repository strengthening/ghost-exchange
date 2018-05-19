const qs = require('querystring');
const request = require('request');

const E = require('../error/define');

function get(url, param) {
  return new Promise((resolve, reject) => {
    const headers = {
      'User-Agent': 'request',
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    };
    const options = {
      url: `${url}?${qs.stringify(param)}`,
      headers,
      forever: true,
      timeout: 5000,
    };

    request(options, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        return resolve(body);
      }
      if (error) return reject(error);
      if (body) return reject(body);
      if (res) return reject(res);
      return reject(E.ERR_HTTP_NO_REASON);
    });
  });
}

function post(url, param) {
  return new Promise((resolve, reject) => {
    request.post(url, {
      forever: true,
      form: param,
    }, (error, res, body) => {
      if (!error && res.statusCode === 200) {
        return resolve(body);
      }
      if (error) return reject(error);
      if (body) return reject(body);
      if (res) return reject(res);
      return reject(E.ERR_HTTP_NO_REASON);
    });
  });
}

module.exports = { get, post };
