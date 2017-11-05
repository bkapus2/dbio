export default function aInB(a,b) {
  for (var key in a) {
    if (a[key]!==b[key])
      return false;
    return true;
  }
}

export default function where(obj) {
  return function filterWhere(_obj) {
    return aInB(obj, _obj)
  }
}