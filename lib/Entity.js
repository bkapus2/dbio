export default class Entity {
  constructor(_={}) {
    for (var { key, type } of this.model) {

      const typeOf = typeof _[key];

      if (type === 'INTEGER') {
        if (typeOf === 'number') {
          this[key] = _[key];
        }
        else if (_[key] === null) {
          this[key] = null;
        }
        else if (_[key] === undefined) {
          this[key] = undefined;
        }
        else {
          throw new Error(`${typeof _[key]} cannot be converted to INTEGER`)
        }
      }

      else if (type === 'TEXT') {
        if (typeOf === 'string') {
          this[key] = _[key];
        }
        else if (typeOf === 'number') {
          this[key] = _[key].toString();
        }
        else if (_[key] === null) {
          this[key] = null;
        }
        else if (_[key] === undefined) {
          this[key] = undefined;
        }
        else {
          throw new Error(`${typeof _[key]} cannot be converted to TEXT`)
        }
      }

      else if (type === 'BOOLEAN') {
        if (typeOf === 'boolean') {
          this[key] = _[key];
        }
        else if (_[key] === null) {
          this[key] = null;
        }
        else if (_[key] === undefined) {
          this[key] = undefined;
        }
        else {
          throw new Error(`${typeof _[key]} cannot be converted to BOOLEAN`)
        }
      }

      else if (type === 'TIMESTAMP') {
        if (_[key] instanceof Date) {
          this[key] = _[key];
        }
        else if (typeOf === 'object') {
          const date = new Date(_[key]);
          if (isNaN(date.valueOf()))
            throw new Error(`${key} is not a valid date`);
          this[key] = date;
        }
        else if (typeOf === 'string') {
          const date = new Date(_[key]);
          if (isNaN(date.valueOf()))
            throw new Error(`${key} is not a valid date`);
          this[key] = date;
        }
        else if (_[key] === null) {
          this[key] = null;
        }
        else if (_[key] === undefined) {
          this[key] = undefined;
        }
        else {
          throw new Error(`${typeof _[key]} cannot be converted to TIMESTAMP`)
        }
      }

      else {
        throw new Error(`unsupported type (${type})`)
      }
    }
  }
}