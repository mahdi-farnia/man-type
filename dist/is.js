const { join, basename, extname } = require('path');
const { statSync, readdirSync } = require('fs');

/**
 * @typedef { (arg: any) => Boolean } DetectorFn
 */

const isArray = Array.isArray;

const reverseBoolean = (arg) => !arg,
  returnFalse = () => false;

class Is {
  constructor(arg, expect, deep) {
    this.arg = arg;
    this.expect = expect;
    // Check for array
    this.useDeepCheck = deep === true && isArray(arg);
    // Check functions?
    this.hasExpect = typeof expect !== 'undefined';

    // Solve array of expect
    if (isArray(expect)) this.returnExpectArrayResult();
  }

  check() {
    const { arg, expect, useDeepCheck, hasExpect } = this;

    if (hasExpect) {
      const detectorFn = this.useModule(expect);

      if (useDeepCheck) {
        return arg.every((_arg) => !!detectorFn.call(init, _arg));
      } else {
        return !!detectorFn.call(init, arg);
      }
    } else {
      if (arguments.length > 1) {
        return arg === expect;
      } else return !!arg;
    }
  }

  /**
   * import modules
   * @param {string} which
   * @returns {(arg: any) => boolean}
   */
  useModule(which) {
    // Import form functions
    if (typeof which === 'string') {
      const func = fn[which];

      if (func != null) return func;

      if (which[0] === '!') {
        const func = fn[which.slice(1)];

        if (func != null) {
          return function () {
            return reverseBoolean(func.apply(void 0, arguments));
          };
        }
      }

      return returnFalse;
    }

    // Use given function
    if (typeof which === 'function') return which;

    // Function not found!
    return returnFalse;
  }

  returnExpectArrayResult() {
    this.check = () =>
      this.expect.every((expectation) =>
        init(this.arg, expectation, this.useDeepCheck)
      );
  }
}

/**
 * @param { any } arg
 * @param { any } [expect]
 * @param { Boolean } [deep]
 * @param { (arg: { path?: string, argument: any, result: any, name: string | 'anonymous' }) => void } [debug]
 */
const init = (Is.init = (arg, expect, deep) => {
  return new Is(arg, expect, deep).check();
});

/**
 * @type {{ [detectorFnName: string]: (arg: any) => Boolean }}
 */
const fn = (Is.init.fn = {});

const registerFileAsFunction = (path) => {
  const detectorName = basename(path, '.js');

  fn[detectorName] = require(path);
};

const registerDirectory = (path) => {
  const files = readdirSync(path, { encoding: 'utf-8' });

  files.forEach((file) => {
    const pathToFile = join(path, file);

    if (!statSync(pathToFile).isFile()) return;
    if (extname(file) !== '.js') return;

    registerFileAsFunction(pathToFile);
  });
};

Is.init.register = function (path) {
  if (this(path, 'string')) {
    const pathToDetector = join(__dirname, path);

    try {
      const detectorInfo = statSync(pathToDetector);

      if (detectorInfo.isDirectory()) return registerDirectory(pathToDetector);
      else if (detectorInfo.isFile())
        return registerFileAsFunction(pathToDetector);
      else {
        throw void 0;
      }
    } catch (err) {
      throw new Error(
        'Error Occured In Find Path! path: ' + pathToDetector + '\n' + err
      );
    }
  }

  if (this(path, 'plainobject')) {
    for (const key in path) {
      const prop = path[key];

      if (this(prop, 'function')) fn[key] = prop.bind(path);
    }
  }

  return this;
};

// Register functions
registerDirectory(join(__dirname, './detectors'));

module.exports = Is.init;
