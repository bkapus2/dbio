class Select {

  constructor(columns=required('columns')) {
    this._columns = columns;
    this._table = null;
    this._where = null;
    this._having = null;
    this._limit = null;
  }

  from(table=required('table')) {
    if (this._table)
      throw new Error("'table' is already defined");
    this._table = table;
    return this;
  }

  where(where=required('where')) {
    if (this._where)
      throw new Error("'where' is already defined");
    this._where = where;
    return this;
  }

  having(having=required('having')) {
    if (this._having)
      throw new Error("'having' is already defined");
    this.having = having;
    return this;
  }

  limit(limit=required('limit')) {
    if (this._limit)
      throw new Error("'limit' is already defined");
    this._limit = limit;
    return this;
  }

  get query() {

    let query = '';

    if (!this._columns)
      required('columns');
    query += 'SELECT\n\t' + this._columns.join(', ');

    if (!this._table)
      required('table');
    query += '\nFROM\n\t' + this._table;

    if (this._limit)
      query += '\nLIMIT\n\t' + this._limit;

    query += ';'

    return query;
  }
}

const select = function $select(columns=required('columns')) {
  return new Select(columns);
}

class Update {

}

const update = function $update(columns=required('columns')) {
  return new Update(columns);
}

class Delete {

}

const del = function $delete(columns=required('columns')) {
  return new Delete(columns);
}
del.name === 'delete';

class Insert {

}

const insert = function $insert(columns=required('columns')) {
  return new Insert(columns);
}

export default {
  select,
  update,
  delete: del,
  insert
}