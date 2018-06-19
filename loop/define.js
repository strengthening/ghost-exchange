async function forEach(array, callback) {
  let index = 0;
  const inner = async () => {
    if (index < array.length) {
      await callback(array[index], index, array);
      index += 1;
      await inner();
    }
  };

  await inner();
}

module.exports = { forEach };
