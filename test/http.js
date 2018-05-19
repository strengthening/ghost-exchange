const http = require('../http/define');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  //  关闭日志
  process.exit(1);
});

describe('http', () => {
  describe('http', () => {
    it('http.parse should success', (done) => {
      http.get('https://www.baidu.com', { a: 1, b: 2 }).then((data) => {
        console.log(data);
        done();
      }, (err) => {
        console.error(err);
        done();
      });
    });
  });
});
