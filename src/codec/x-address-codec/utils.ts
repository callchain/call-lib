function seqEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

function isSequence(val) {
  return val.length !== undefined;
}

/**
* Concatenates all `arguments` into a single array. Each argument can be either
* a single element or a sequence, which has a `length` property and supports
* element retrieval via sequence[ix].
*
* > concatArgs(1, [2, 3], new Buffer([4,5]), new Uint8Array([6, 7]));
*  [1,2,3,4,5,6,7]
*
* @return {Array} - concatenated arguments
*/
function concatArgs(...args) {
  const ret = [];
  args.forEach((arg) => {
    if (isSequence(arg)) {
      for (let j = 0; j < arg.length; j++) {
        ret.push(arg[j]);
      }
    } else {
      ret.push(arg);
    }
  });
  return ret;
}

function isSet(o) {
  return o !== null && o !== undefined;
}

export {
  seqEqual,
  concatArgs,
  isSet
}
