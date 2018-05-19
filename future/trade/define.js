const C = require('../../constant/define');

const defaultConf = require('../../config/config.json');

const FutureTradeOkex = require('./okex');

class FutureTrade {
  constructor(config) {
    if (config.okex) {
      Object.assign(defaultConf.okex, config.okex);
    }
    if (config.hbpro) {
      Object.assign(defaultConf.hbpro, config.hbpro);
    }
    this.config = defaultConf;
    this.okex = new FutureTradeOkex(this.config.okex);
  }

  userInfo(exchange) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.userInfo();
    }
    return this.okex.userInfo();
  }

  orderInfo(symbol, exchange, contractType, orderId) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.orderInfo(symbol, contractType, orderId);
    }
    return this.okex.orderInfo(symbol, contractType, orderId);
  }

  cancel(symbol, exchange, contractType, orderId) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.cancel(symbol, contractType, orderId);
    }
    return this.okex.cancel(symbol, contractType, orderId);
  }

  openLong(symbol, exchange, contractType, amount, price, leverRate) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.openLong(symbol, contractType, amount, price, leverRate);
    }
    return this.okex.openLong(symbol, contractType, amount, price, leverRate);
  }

  openShort(symbol, exchange, contractType, amount, price, leverRate) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.openShort(symbol, contractType, amount, price, leverRate);
    }
    return this.okex.openShort(symbol, contractType, amount, price, leverRate);
  }

  liquidateLong(symbol, exchange, contractType, amount, price, leverRate) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.liquidateLong(symbol, contractType, amount, price, leverRate);
    }
    return this.okex.liquidateLong(symbol, contractType, amount, price, leverRate);
  }

  liquidateShort(symbol, exchange, contractType, amount, price, leverRate) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.liquidateShort(symbol, contractType, amount, price, leverRate);
    }
    return this.okex.liquidateShort(symbol, contractType, amount, price, leverRate);
  }
}

module.exports = FutureTrade;
