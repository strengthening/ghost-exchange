const C = require('../../constant/define');

const time = require('../../time/define');
const defaultConf = require('../../config/config.json');

const FutureMarketOkex = require('./okex');

class FutureMarket {
  constructor(config) {
    if (config.okex) {
      Object.assign(defaultConf.okex, config.okex);
    }
    if (config.hbpro) {
      Object.assign(defaultConf.hbpro, config.hbpro);
    }
    this.config = defaultConf;
    this.okex = new FutureMarketOkex(this.config.okex);
  }

  tick(symbol, exchange, contractType) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.tick(symbol, contractType);
    }
    return this.okex.tick(symbol, contractType);
  }

  depth(symbol, exchange, contractType) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.depth(symbol, contractType);
    }
    return this.okex.depth(symbol, contractType);
  }

  limit(symbol, exchange, contractType) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.limit(symbol, contractType);
    }
    return this.okex.limit(symbol, contractType);
  }

  kline(symbol, exchange, contractType, type) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.kline(symbol, contractType, type);
    }
    return this.okex.kline(symbol, contractType, type);
  }

  minKline(symbol, exchange, contractType) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.minKline(symbol, contractType);
    }
    return this.okex.minKline(symbol, contractType);
  }

  dayKline(symbol, exchange, contractType) {
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.dayKline(symbol, contractType);
    }
    return this.okex.dayKline(symbol, contractType);
  }

  history(symbol, exchange, dueTimestamp, since) {
    const dateFmt = time.string(dueTimestamp, C.DATE_STANDARD_FORMAT);
    if (exchange === C.EXCHANGE_OKEX) {
      return this.okex.history(symbol, dateFmt, since);
    }
    return this.okex.history(symbol, dateFmt, since);
  }
}

module.exports = FutureMarket;
