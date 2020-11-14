module.exports = function (arg) {
  const prot = Promise.prototype;

  return (
    this(arg, 'object') && prot.then === arg.then && prot.catch === arg.catch
  );
};
