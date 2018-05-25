const crypto = require('crypto');
const C = require('../../constant/define');
const E = require('../../error/define');
const time = require('../../time/define');
const http = require('../../http/define');

class FutureTradeOkex {
  constructor(config) {
    this.config = config;
  }

  userInfo() {
    return new Promise((resolve) => {
      const param = FutureTradeOkex.sign({
        api_key: this.config.api_key,
      }, this.config.secret_key);

      http.post(`${this.config.base_url}/api/v1/future_userinfo.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  orderInfo(symbol, contractType, orderId) {
    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      order_id: orderId,
      api_key: this.config.api_key,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      http.post(`${this.config.base_url}/api/v1/future_order_info.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  cancel(symbol, contractType, orderId) {
    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      order_id: orderId,
      api_key: this.config.api_key,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      let retryTime = 0;
      const inner = () => {
        retryTime += 1;
        http.post(`${this.config.base_url}/api/v1/future_cancel.do`, param)
          .then(async (dataStr) => {
            const dataObj = JSON.parse(dataStr);
            if (dataObj.result) {
              return resolve([dataObj, undefined]);
            }
            // the order haved dealed
            if (!dataObj.result && dataObj.error_code === E.OKEX.FUTURE.ERR_ORDER_NOT_EXIST) {
              return resolve([{ result: true, order_id: orderId }, undefined]);
            }
            // cancel order is to freq so retry sometime, or cancel to quick retry
            if (!dataObj.result && retryTime < this.config.retry_time &&
              (dataObj.error_code === E.OKEX.FUTURE.ERR_REQUEST_TOO_FREQUENCY ||
                dataObj.error_code === E.OKEX.FUTURE.ERR_SYSTEM_ERROR)) {
              await time.delay(5 * time.SECOND);
              inner();
            }
            return resolve([undefined, dataStr]);
          }, (err) => {
            resolve([undefined, err]);
          });
      };
      inner();
    });
  }

  openLong(symbol, contractType, amount, price, leverRate) {
    let lever = leverRate;
    if (lever !== C.LEVER_RATE_OKEX_LEVEL1 && lever !== C.LEVER_RATE_OKEX_LEVEL2) {
      //  默认开启10倍杠杆
      lever = C.LEVER_RATE_OKEX_LEVEL1;
    }

    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      price,
      amount,
      lever_rate: lever,
      api_key: this.config.api_key,
      type: C.OPEN_LONG_OKEX,
      match_price: 0,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      http.post(`${this.config.base_url}/api/v1/future_trade.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  openShort(symbol, contractType, amount, price, leverRate) {
    let lever = leverRate;
    if (lever !== C.LEVER_RATE_OKEX_LEVEL1 && lever !== C.LEVER_RATE_OKEX_LEVEL2) {
      //  默认开启10倍杠杆
      lever = C.LEVER_RATE_OKEX_LEVEL1;
    }

    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      price,
      amount,
      lever_rate: lever,
      api_key: this.config.api_key,
      type: C.OPEN_SHORT_OKEX,
      match_price: 0,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      http.post(`${this.config.base_url}/api/v1/future_trade.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  liquidateLong(symbol, contractType, amount, price, leverRate) {
    let lever = leverRate;
    if (lever !== C.LEVER_RATE_OKEX_LEVEL1 &&
      lever !== C.LEVER_RATE_OKEX_LEVEL2) {
      //  默认开启10倍杠杆
      lever = C.LEVER_RATE_OKEX_LEVEL1;
    }
    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      price,
      amount,
      lever_rate: leverRate,
      type: C.LIQUIDATE_LONG_OKEX,
      match_price: 0,
      api_key: this.config.api_key,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      http.post(`${this.config.base_url}/api/v1/future_trade.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  liquidateShort(symbol, contractType, amount, price, leverRate) {
    let lever = leverRate;
    if (lever !== C.LEVER_RATE_OKEX_LEVEL1 &&
      lever !== C.LEVER_RATE_OKEX_LEVEL2) {
      //  默认开启10倍杠杆
      lever = C.LEVER_RATE_OKEX_LEVEL1;
    }

    const param = FutureTradeOkex.sign({
      symbol,
      contract_type: contractType,
      price,
      amount,
      lever_rate: lever,
      type: C.LIQUIDATE_SHORT_OKEX,
      api_key: this.config.api_key,
      match_price: 0,
    }, this.config.secret_key);

    return new Promise((resolve) => {
      http.post(`${this.config.base_url}/api/v1/future_trade.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
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

module.exports = FutureTradeOkex;
