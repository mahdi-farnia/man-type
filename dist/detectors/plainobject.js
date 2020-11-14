module.exports = function (arg) {
  const isObjectObj = (o) =>
    this(o, 'object') &&
    !this(o, 'array') &&
    Object.prototype.toString.call(o) === '[object Object]';

  if (!isObjectObj(arg)) return false;

  let ctor = arg.constructor,
    prot;
  if (!this(ctor, 'function')) return false;

  prot = ctor.prototype;
  if (!isObjectObj(prot)) return false;

  if (!prot.hasOwnProperty('isPrototypeOf')) return false;

  return true;
};
