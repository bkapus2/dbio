import required from './required';
import Entity from './Entity';
import Collection from './Collection';
import assert from './assert';

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
  'BOOLEAN',
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
