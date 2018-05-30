const crypto = require('crypto');

const E = require('../../error/define');
const C = require('../../constant/define');

const http = require('../../http/define');
const time = require('../../time/define');

class FutureMarketOkex {
  constructor(config) {
    this.config = config;
  }

  tick(symbol, contractType) {
    const param = { symbol, contract_type: contractType };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_ticker.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  depth(symbol, contractType) {
    const param = {
      symbol,
      contract_type: contractType,
      size: 200,
      merge: 0, // 不合并深度
    };

    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_depth.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          if (dataObj.asks) {
            dataObj.asks.reverse(); // reverse the array
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  trades(symbol, contractType) {
    const param = {
      symbol,
      contract_type: contractType,
    };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_trades.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.length && dataObj.length > 0) {
            //  change to the right type
            for (let i = 0; i < dataObj.length; i += 1) {
              dataObj[i].amount = parseInt(dataObj[i].amount, 10);
              dataObj[i].price = parseFloat(dataObj[i].price);
              dataObj[i].symbol = symbol;
            }
            return resolve([dataObj, undefined]);
          }
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  kline(symbol, contractType, type) {
    const param = {
      symbol,
      contract_type: contractType,
      type,
      size: 300,
      since: 0,
    };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_kline.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  minKline(symbol, contractType) {
    const param = {
      symbol,
      contract_type: contractType,
      type: '1min',
      size: 300,
      since: 0,
    };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_kline.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  dayKline(symbol, contractType) {
    const param = {
      symbol,
      contract_type: contractType,
      type: '1day',
      size: 200,
      since: 0,
    };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_kline.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  limit(symbol, contractType) {
    const param = { symbol, contract_type: contractType };
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.get(`${this.config.base_url}/api/v1/future_price_limit.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result !== undefined && !dataObj.result) {
            return resolve([undefined, dataStr]);
          }
          return resolve([dataObj, undefined]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  history(symbol, date, since) {
    const param = FutureMarketOkex.sign({
      symbol,
      date,
      since,
      api_key: this.config.api_key,
    }, this.config.secret_key);
    const dueTimestamp = time.parse(date, C.DATE_STANDARD_FORMAT) + (16 * 60 * 60 * 1000);
    return new Promise((resolve) => {
      let lastErr = E.ERR_HTTP_RETRY_OUT;
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.post(`${this.config.base_url}/api/v1/future_trades_history.do`, param).then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.length && dataObj.length > 0) {
            //  change to the right type
            for (let i = 0; i < dataObj.length; i += 1) {
              dataObj[i].amount = parseInt(dataObj[i].amount, 10);
              dataObj[i].price = parseFloat(dataObj[i].price);
              dataObj[i].due_timestamp = dueTimestamp;
              dataObj[i].symbol = symbol;
            }
            return resolve([dataObj, undefined]);
          }
          return resolve([undefined, dataStr]);
        }, (err) => {
          if (retryTime <= this.config.retry_time) {
            lastErr = err;
            return inner();
          }
          return resolve([undefined, lastErr]);
        });
      };
      inner();
    });
  }

  static sign(param, secret) {
    const p = param;
    const keyArr = Object.keys(p).sort();
    let signStr = '';
    for (let i = 0; i < keyArr.length; i += 1) {
      signStr += `${keyArr[i]}=${p[keyArr[i]]}&`;
    }
    signStr = `${signStr}secret_key=${secret}`;
    const md5 = crypto.createHash('md5');
    md5.update(signStr);
    p.sign = md5.digest('hex').toLocaleUpperCase(); // MD5值
    return p;
  }
}

module.exports = FutureMarketOkex;
