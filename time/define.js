const C = require('../constant/define');

function parse(dateStr, format) {
  let timestamp = -1;
  let d = dateStr;
  if (typeof d === 'number') {
    d += '';
  }
  if (format === C.DATE_SHORT_FORMAT) {
    timestamp = new Date(
      parseInt(d.substr(0, 4), 10),
      parseInt(d.substr(4, 2), 10) - 1,
      parseInt(d.substr(6, 2), 10),
    ).getTime();
  } else if (format === C.DATETIME_SHORT_FORMAT) {
    timestamp = new Date(
      parseInt(d.substr(0, 4), 10), parseInt(d.substr(4, 2), 10) - 1,
      parseInt(d.substr(6, 2), 10), parseInt(d.substr(8, 2), 10),
      parseInt(d.substr(10, 2), 10), parseInt(d.substr(12, 2), 10),
    ).getTime();
  } else if (format === C.DATE_STANDARD_FORMAT) {
    timestamp = new Date(
      parseInt(d.substr(0, 4), 10),
      parseInt(d.substr(5, 2), 10) - 1,
      parseInt(d.substr(8, 2), 10),
    ).getTime();
  } else if (format === C.DATETIME_STANDARD_FORMAT) {
    timestamp = new Date(
      parseInt(d.substr(0, 4), 10), parseInt(d.substr(5, 2), 10) - 1,
      parseInt(d.substr(8, 2), 10), parseInt(d.substr(11, 2), 10),
      parseInt(d.substr(14, 2), 10), parseInt(d.substr(17, 2), 10),
    ).getTime();
  } else {
    throw new Error(`Can not recognize the format: ${format}`);
  }
  return timestamp;
}

function string(timestamp, format) {
  let dateStr;
  const date = new Date(timestamp);
  const yyyy = date.getFullYear().toString();
  const MM = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const dd = date.getDate() < 9 ? `0${date.getDate()}` : `${date.getDate()}`;

  if (format === C.DATE_SHORT_FORMAT || format === C.DATE_STANDARD_FORMAT) {
    dateStr = format === C.DATE_SHORT_FORMAT ? yyyy + MM + dd : `${yyyy}-${MM}-${dd}`;
  } else if (format === C.DATETIME_SHORT_FORMAT || format === C.DATETIME_STANDARD_FORMAT) {
    const HH = date.getHours() < 9 ? `0${date.getHours()}` : date.getHours().toString();
    const mm = date.getMinutes() < 9 ? `0${date.getMinutes()}` : date.getMinutes().toString();
    const ss = date.getSeconds() < 9 ? `0${date.getSeconds()}` : date.getSeconds().toString();
    if (format === C.DATETIME_SHORT_FORMAT) {
      dateStr = yyyy + MM + dd + HH + mm + ss;
    } else {
      dateStr = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    }
  } else {
    throw new Error(`Can not recognize the format: ${format}`);
  }
  return dateStr;
}

function month(timestamp) {
  let t = timestamp;
  if (t === undefined) {
    t = new Date().getTime();
  }
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

function day(timestamp) {
  let t = timestamp;
  if (t === undefined) {
    t = new Date().getTime();
  }
  const target = new Date(1970, 9, 28).getTime();
  const days = parseInt((t - target) / (24 * 60 * 60 * 1000), 10);
  return target + (days * 24 * 60 * 60 * 1000);
}

function hour(timestamp) {
  let t = timestamp;
  if (t === undefined) {
    t = new Date().getTime();
  }
  return parseInt(t / 60000 / 60, 10) * 60000 * 60;
}

function minute(timestamp) {
  let t = timestamp;
  if (t === undefined) {
    t = new Date().getTime();
  }
  return parseInt(t / 60000, 10) * 60000;
}

function delay(interval) {
  return new Promise((resolve) => {
    let i = interval;
    if (i === undefined || i < 0) {
      i = 0;
    }

    setTimeout(() => {
      resolve();
    }, i);
  });
}

module.exports = {
  parse,
  string,
  delay,
  minute,
  hour,
  day,
  month,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
};
