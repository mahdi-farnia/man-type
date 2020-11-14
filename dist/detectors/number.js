module.exports = function (arg) {
  return typeof arg === 'number' && isFinite(arg);
};
