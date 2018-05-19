const assert = require('assert');

const C = require('../constant/define');
const time = require('../time/define');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  //  关闭日志
  process.exit(1);
});

describe('time', () => {
  describe('time', () => {
    it('time.parse should success', (done) => {
      const timestamp1 = time.parse('20180331', C.DATE_SHORT_FORMAT);
      console.log(`20180331 is ${timestamp1}`);
      const timestamp2 = time.parse('2018-03-31', C.DATE_STANDARD_FORMAT);
      console.log(`2018-03-31 is ${timestamp2}`);
      assert.equal(timestamp1, timestamp2);

      const timestamp3 = time.parse('20180331103021', C.DATETIME_SHORT_FORMAT);
      console.log(`20180331103021 is ${timestamp3}`);
      const timestamp4 = time.parse('2018-03-31 10:30:21', C.DATETIME_STANDARD_FORMAT);
      console.log(`2018-03-31 10:30:21 is ${timestamp4}`);
      assert.equal(timestamp3, timestamp4);
      done();
    });
  });

  describe('time', () => {
    it('time.string should success', (done) => {
      const dateStr = time.string(time.month(), C.DATETIME_STANDARD_FORMAT);
      console.log(dateStr);
      done();
    });
  });

  describe('time', () => {
    it('time.delay should success', (done) => {
      (async () => {
        await time.delay(200);
        done();
      })();
    });
  });
});
