export default class Entity {
  constructor(_={}) {
    console.log(this.model)
    for (var { key, type } of this.model) {

      const typeOf = typeof _[key];

      if (type === 'INTEGER') {
        if (typeOf === 'number') {
          this[key] = _[key];
        }
        else if (_[key] === null) {
          this[key] = null;
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
      }

      else if (type === 'BOOLEAN') {
        if (typeOf === 'boolean') {
          this[key] = _[key];
        }
        else if (_[key] === null) {
          this[key] = null;
        }
      }

      else if (type === 'TIMESTAMP') {
        if (typeOf === 'object') {
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
      }

      else {
        throw new Error(`unsupported type (${type})`)
      }
    }
  }
}