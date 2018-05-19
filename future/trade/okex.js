const crypto = require('crypto');

const C = require('../../constant/define');

const http = require('../../http/define');
const time = require('../../time/define');
const pms = require('../../promise/define');

class FutureTradeOkex {
  constructor(config) {
    this.config = config;
  }

  userInfo() {
    return new Promise((resolve) => {
      const param = this.sign({
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
    const param = this.sign({
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
    return new Promise(async (resolve) => {
      const param = this.sign({
        symbol,
        contract_type: contractType,
        order_id: orderId,
        api_key: this.config.api_key,
      }, this.config.secret_key);

      http.post(`${this.config.base_url}/api/v1/future_cancel.do`, param)
        .then((dataStr) => {
          const dataObj = JSON.parse(dataStr);
          if (dataObj.result) return resolve([dataObj, undefined]);
          return resolve([undefined, dataStr]);
        }, (err) => {
          resolve([undefined, err]);
        });
    });
  }

  cancelOrderInfo(symbol, contractType, orderId) {
    return new Promise(async (resolve) => {
      const param = this.sign({
        symbol,
        contract_type: contractType,
        order_id: orderId,
        api_key: this.config.api_key,
      }, this.config.secret_key);

      await time.delay(20);
      const [orderObj, orderErr] = await this.orderInfo(symbol, contractType, orderId);

      if (orderObj && orderObj.orders && orderObj.orders.length > 0 &&
        (orderObj.orders[0].status === 2 || orderObj.orders[0].status === -1)) {
        return resolve([orderObj, orderErr]);
      }

      let [dataStr, dataErr] = await pms.standard(http
        .post(`${this.config.base_url}/api/v1/future_cancel.do`, param));

      //  如果是频繁操作，则等待一个随机时间再次撤销
      while (dataErr && typeof dataErr === 'string' && dataErr.indexOf('20049')) {
        await time.delay((Math.random() * 2000) + 2000);
        [dataStr, dataErr] = await pms.standard(http
          .post(`${this.config.base_url}/api/v1/future_cancel.do`, param));
      }

      if (dataErr) {
        return resolve([undefined, dataErr]);
      }

      let dataObj = JSON.parse(dataStr);
      let err = undefined;

      if (!dataObj.result && dataObj.error_code !== 20015 && dataObj.error_code !== 20014) {
        return resolve([undefined, dataStr]);
      }

      for (let idx = 0; idx < 15; idx += 1) {
        [dataObj, err] = await this.orderInfo(symbol, contractType, orderId);
        if (err) return resolve([undefined, err]);
        //  此处有时会返回{result:true,orders:[]}，所以必须进行数组长度判断
        if (orderObj && orderObj.orders.length > 0 &&
          (dataObj.orders[0].status === 2 || dataObj.orders[0].status === -1)) {
          return resolve([dataObj, err]);
        }
        await time.delay(500);
      }

      return resolve([undefined, `Try too many times to get order: ${orderId}`]);
    });
  }

  openLong(symbol, contractType, amount, price, leverRate) {
    let lever = leverRate;
    if (lever !== C.LEVER_RATE_OKEX_LEVEL1 && lever !== C.LEVER_RATE_OKEX_LEVEL2) {
      //  默认开启10倍杠杆
      lever = C.LEVER_RATE_OKEX_LEVEL1;
    }

    const param = this.sign({
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

    const param = this.sign({
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
    const param = this.sign({
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

    const param = this.sign({
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

  sign(param, secret) {
    const keyArr = Object.keys(param).sort();
    let signStr = '';
    for (let i = 0; i < keyArr.length; i += 1) {
      signStr += `${keyArr[i]}=${param[keyArr[i]]}&`;
    }
    signStr = `${signStr}secret_key=${secret}`;
    const md5 = crypto.createHash('md5');
    md5.update(signStr);
    param.sign = md5.digest('hex').toLocaleUpperCase();  // MD5值
    return param;
  }
}

module.exports = FutureTradeOkex;
