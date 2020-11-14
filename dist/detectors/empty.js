module.exports = function (arg) {
  if (this(arg, 'plainobject')) {
    return Object.keys(arg).length === 0;
  }

  if (this(arg, 'array') || this(arg, 'string')) {
    return arg.length === 0;
  }

  return arg == null;
};
