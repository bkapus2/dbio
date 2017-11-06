class Assert {
  constructor(arg, { name=required('name') }={}) {
    this.arg = arg;
    this.typeOf = typeof arg;
    this.name = name;
  }
  isDefined() {
    if (this.arg === undefined)
      throw new Error(`${this.name} is not defined`);
    return this;
  }
  isEqualTo(value) {
    if (this.arg !== value)
      throw new Error(`${this.name} is not equal to ${value}`);
    return this;
  }
  isString() {
    if (this.typeOf !== 'string')
      throw new Error(`${this.name} is not of type string`);
    return this;
  }
  isArray() {
    if (!Array.isArray(this.arg))
      throw new Error(`${this.name} is not of type array`);
    return this;
  }
  isObject() {
    if (this.typeOf !== 'object')
      throw new Error(`${this.name} is not of type object`);
    return this;
  }
  isNotNull() {    
    if (this.arg === null)
      throw new Error(`${this.name} is null`);
    return this;
  }
  isOfAllowedValues(values) {
    const index = values.indexOf(this.arg);
    if (index === -1)
      throw new Error(`${this.name} is not an allowed value`);
    return this
  }
  hasLength(n) {
    const len = this.arg.length
    if (len === undefined)
      throw new Error(`${this.name} does not have a length`);
    if (n && len < n)
      throw new Error(`${this.name} length is not atleast ${n}`);
    return this;
  }
  forEach(callback) {
    this.isArray;
    this.arg.forEach(callback);
    return this;
  }
}

function assert(...arg) {
  return new Assert(...arg);
}

export default assert;