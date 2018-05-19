const assert = require('assert');

const C = require('../constant/define');
const config = require('../config/config.json');
const time = require('../time/define');
const FutureMarketOkex = require('../future/market/okex');

const testSwitch = [true, true, true, true, true, true, true];
const futureMarket = new FutureMarketOkex(config.okex);
let testStart = -1;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  //  关闭日志
  process.exit(1);
});

describe('future', () => {
  describe('future.market.okex', () => {
    it('ticker should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket
            .tick(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_NEXT_WEEK);
          assert.equal(tickErr, undefined);
          console.log(JSON.stringify(tick), tickErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market.okex', () => {
    it('depth should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [depth, depthErr] = await futureMarket
            .depth(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_NEXT_WEEK);
          assert.equal(depthErr, undefined);
          console.log(JSON.stringify(depth), depthErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market.okex', () => {
    it('trades should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [trade, tradeErr] = await futureMarket
            .trades(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_THIS_WEEK);
          assert.equal(tradeErr, undefined);
          console.log(JSON.stringify(trade), tradeErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });
  describe('future.market.okex', () => {
    it('minKline should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [minKline, minKlineErr] = await futureMarket
            .minKline(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(minKlineErr, undefined);
          console.log(JSON.stringify(minKline), minKlineErr);
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
          const [dayKline, dayKlineErr] = await futureMarket
            .dayKline(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(dayKlineErr, undefined);
          console.log(JSON.stringify(dayKline), dayKlineErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market.okex', () => {
    it('limit should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [limit, limitErr] = await futureMarket
            .limit(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(limitErr, undefined);
          console.log(JSON.stringify(limit), limitErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.market.okex', () => {
    it('history should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket
            .tick(C.SYMBOL_BTC_USD, C.CONTRACT_TYPE_OKEX_THIS_WEEK);
          assert.equal(tickErr, undefined);
          const contractId = tick.ticker.contract_id.toString();
          const ts = time.parse(contractId, C.DATE_SHORT_FORMAT);
          const dateStr = time.string(ts, C.DATE_STANDARD_FORMAT);

          const [dataObj, dataObjErr] = await futureMarket
            .history(C.SYMBOL_BTC_USD, dateStr, 557041027284991);
          assert.equal(dataObjErr, undefined);
          console.log(JSON.stringify(dataObj), dataObjErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });
});
