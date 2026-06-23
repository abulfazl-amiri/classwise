/**
 * parses string based times e.g. 1s, 1m, 1h, 1d to milliseconds
 * @param {*} str the string to parse
 * @returns
 */
const parseToMs = function (str) {
  const unit = str.at(-1);
  const value = parseInt(str);

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Invalid unit or value: (unit: ${unit}), (value: ${value}), (str: ${str})`);
  }
};

const parseToSec = function (str) {
  return parseToMs(str) / 1000;
};

export { parseToMs, parseToSec };
