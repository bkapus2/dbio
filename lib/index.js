import required from './required';
import Entity from './Entity';
import Collection from './Collection';

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

function registerQueryHandler(func) {
  if (typeof func !== 'function')
    throw new Error("argument must be a function");
  if (this._submitQuery)
    throw new Error("submitQuery is already assigned")
  submitQuery = func;
}

const databaseTypes = [
  'TEXT',
  'INTEGER',
  'TIMESTAMP'
];

function validateModel(model) {

  const assertProp = prop => {
    assert(prop, { name: 'prop' })
      .isDefined()
      .isNotNull()
      .isObject();
    assert(prop.key, { name: 'key' })
      .isDefined()
      .isString()
      .hasLength(1);
    assert(prop.column, { name: 'column' })
      .isDefined()
      .isString()
      .hasLength(1);
    assert(prop.type, { name: 'type' })
      .isDefined()
      .isString()
      .isOfAllowedValues(databaseTypes);    
  }

  assert(model, { name: 'model'})
    .isDefined()
    .isNotNull()
    .isArray()
    .forEach(assertProp);
}

function validateKey(key) {

  assert(key, { name: 'key'})
    .isDefined()
    .isNotNull()
    .isString()
    .hasLength(1);
}

function registerEntity({ key, model, beforeCreate, afterCreate, beforeUpdate,
  afterUpdate, beforeRead, afterRead, beforeDelete, afterDelete, actions=[],
  getters=[] }={}) {

  if (this[key])
    throw new Error(`dbio.'${key}' is already defined`);

  validateKey(key)
  validateModel(model);

  const name = key[0].toUpperCase()+key.slice(1);

  const _constructor =  entities[key] = class extends Entity {
    get tableName() {
      return tableName;
    }
    get model() {
      return model;
    }
    static get name() {
      return name;
    }
  }

  for (let action of actions) {
    if (!action.name)
      throw new Error("Cannot assign an unnamed function as an action.")
    _constructor.prototype[action.name] = function(...args) {
      return action.apply(this, args);
    }
  }

  for (let getter of getters) {
    if (!getter.name)
      throw new Error("Cannot assign an unnamed function as an getter.")
    Object.defineProperty(_constructor.prototype, getter.name, {
      get() {
        return getter.apply(this);
      }
    })
  }

  function factoryConstructor(...args) {
    return new _constructor(...args);
  }

  this[key] = factoryConstructor;

  return factoryConstructor;
}

function registerCollection({ key, model, tableName, beforeCreate,
  afterCreate, beforeUpdate, afterUpdate, beforeRead, afterRead,
  beforeDelete, afterDelete }={}) {

  /*
    Validate inputs
  */

  if (this[key])
    throw new Error(`dbio.'${key}' is already defined`);

  assert(tableName, { name: 'tableName' })
    .isDefined()
    .isNotNull()
    .isString()
    .hasLength(1);

  validateKey(key)
  validateModel(model);

  const name = key[0].toUpperCase()+key.slice(1);

  const collection = collections[key] = this[key] = new class extends Collection {
    get tableName() {
      return tableName;
    }
    get model() {
      return model;
    }
    get columns() {
      return this.model.map(prop('column'))
    }
    static get name() {
      return name;
    }
  }

  return collection;
}

const collections = {};
const entities = {};
let submitQuery = null;

const dbio = {
  registerQueryHandler,
  registerEntity,
  registerCollection
};

export default dbio;
