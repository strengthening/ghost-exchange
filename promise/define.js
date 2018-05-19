function standard(promise) {
  return new Promise((resolve) => {
    promise.then((result) => {
      resolve([result, undefined]);
    }, (err) => {
      resolve([undefined, err]);
    });
  });
}

module.exports = { standard };
