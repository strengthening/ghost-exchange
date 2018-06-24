const assert = require('assert');

const C = require('../constant/define');
const config = require('../config/config.json');
const { FutureMarket } = require('../future/define');

const futureMarket = new FutureMarket(config);
const testSwitch = [true, false, false, false, false, false, false];

let testStart = -1;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  //  关闭日志
  process.exit(1);
});

describe('future', () => {
  describe('future.market', () => {
    it('tick should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket.tick(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_NEXT_WEEK,
          );
          assert.equal(tickErr, undefined);
          console.log(JSON.stringify(tick));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market', () => {
    it('depth should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [depth, depthErr] = await futureMarket.depth(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_NEXT_WEEK,
          );
          assert.equal(depthErr, undefined);
          console.log(JSON.stringify(depth));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market', () => {
    it('kline should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [kline, klineErr] = await futureMarket.kline(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_QUARTER, C.KLINE_TYPE_DAY_KLINE,
          );
          assert.equal(klineErr, undefined);
          console.log(JSON.stringify(kline));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market', () => {
    it('minKline should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [minKline, minKlineErr] = await futureMarket.minKline(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_QUARTER,
          );
          assert.equal(minKlineErr, undefined);
          console.log(JSON.stringify(minKline));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market.okex', () => {
    it('dayKline should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [dayKline, dayKlineErr] = await futureMarket.dayKline(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_QUARTER,
          );
          assert.equal(dayKlineErr, undefined);
          console.log(JSON.stringify(dayKline));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market', () => {
    it('limit should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [limit, limitErr] = await futureMarket.limit(
            C.SYMBOL_BTC_USD, C.EXCHANGE_OKEX,
            C.CONTRACT_TYPE_OKEX_QUARTER,
          );
          assert.equal(limitErr, undefined);
          console.log(JSON.stringify(limit));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market', () => {
    it('history should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [history, historyErr] = await futureMarket.history(
            C.SYMBOL_BCH_USD, C.EXCHANGE_OKEX,
            1512115200000, 15652055,
          );
          assert.equal(historyErr, undefined);
          console.log(JSON.stringify(history));
          console.log(history.length);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });
});
