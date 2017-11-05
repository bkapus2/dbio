import queryBuilder from './query-builder';

export default class Collection {

  select(columns = this.model.map(prop('column'))) {
    const _select = queryBuilder.select(columns).from(this.tableName);
    setTimeout(()=>submitQuery(_select.query));
    return _select;
  }

  update() {

  }

  delete() {

  }
}