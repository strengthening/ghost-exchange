const assert = require('assert');

const C = require('../constant/define');
const config = require('../config/config.json');
const FutureTradeOkex = require('../future/trade/okex');
const FutureMarketOkex = require('../future/market/okex');

const testSwitch = [true, true, false, true, true, true, true];
const futureTrade = new FutureTradeOkex(config.okex);
const futureMarket = new FutureMarketOkex(config.okex);
let testStart = -1;

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  //  关闭日志
  process.exit(1);
});

describe('future', () => {
  describe('future.trade.okex', () => {
    it('userInfo should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [ui, uiErr] = await futureTrade.userInfo();
          assert.equal(uiErr, undefined);
          console.log(JSON.stringify(ui));
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.trade.okex', () => {
    // openLong and cancel
    it('openLong should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket
            .tick(C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(tickErr, undefined);
          console.log(tick.ticker.last);

          const lowPrice = tick.ticker.last * 0.9;
          const [ol, olErr] = await futureTrade.openLong(
            C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER,
            1, lowPrice, C.LEVER_RATE_OKEX_LEVEL2,
          );
          assert.equal(olErr, undefined);
          console.log(ol);

          const orderId = ol.order_id;
          const [coi, coiErr] = await futureTrade
            .cancel(C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER, orderId);
          assert.equal(coiErr, undefined);
          console.log(coi, coiErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.trade.okex', () => {
    it('deal and cancel should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket
            .tick(C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(tickErr, undefined);
          console.log(tick.ticker.last);

          const [ol, olErr] = await futureTrade.openLong(
            C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER,
            1, tick.ticker.last * 1.01, C.LEVER_RATE_OKEX_LEVEL2,
          );
          assert.equal(olErr, undefined);
          console.log(ol);

          const orderId = ol.order_id;
          const [coi, coiErr] = await futureTrade
            .cancel(C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER, orderId);
          assert.equal(coiErr, undefined);
          console.log(coi, coiErr);

          const [ll, llErr] = await futureTrade.liquidateLong(
            C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER,
            1, tick.ticker.last * 0.99, C.LEVER_RATE_OKEX_LEVEL2,
          );
          assert.equal(llErr, undefined);
          console.log(ll);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });

  describe('future.trade.okex', () => {
    // openShort
    it('openShort should success', (done) => {
      testStart += 1;
      if (testSwitch[testStart]) {
        (async () => {
          const [tick, tickErr] = await futureMarket
            .tick(C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER);
          assert.equal(tickErr, undefined);
          console.log(tick.ticker.last);

          const lowPrice = tick.ticker.last * 1.1;
          const [ol, olErr] = await futureTrade.openShort(
            C.SYMBOL_ETC_USD, C.CONTRACT_TYPE_OKEX_QUARTER,
            1, lowPrice, C.LEVER_RATE_OKEX_LEVEL2,
          );
          assert.equal(olErr, undefined);
          console.log(ol);

          const orderId = ol.order_id;
          const [coi, coiErr] = await futureTrade.cancel(
            C.SYMBOL_ETC_USD,
            C.CONTRACT_TYPE_OKEX_QUARTER, orderId,
          );
          assert.equal(coiErr, undefined);
          console.log(coi, coiErr);
          done();
        })();
      } else {
        console.log(`case ${testStart} switch off`);
        done();
      }
    });
  });
});
