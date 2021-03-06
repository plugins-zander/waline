const Base = require('./base');

module.exports = class extends Base {
  parseWhere(filter) {
    const where = {};
    if(think.isEmpty(filter)) {
      return where;
    }

    for(const k in filter) {
      if(k === 'objectId') {
        where.id = filter[k];
        continue;
      }

      if(filter[k] === undefined) {
        where[k] = null;
        continue;
      }
      
      where[k] = filter[k];
    }
    return where;
  }

  async select(where, {desc, limit, offset, field} = {}) {
    const instance = this.model(this.tableName);
    instance.where(this.parseWhere(where));
    if(desc) {
      instance.order(`${desc} DESC`);
    }
    if(limit || offset) {
      instance.limit(offset, limit);
    }
    if(field) {
      field.push('id');
      instance.field(field);
    }

    const data = await instance.select();
    return data.map(({id, ...cmt}) => ({...cmt, objectId: id}));
  }

  async count(where = {}) {
    const instance = this.model(this.tableName);
    instance.where(this.parseWhere(where));
    return instance.count();
  }

  async add(data) {
    const instance = this.model(this.tableName);
    const id = await instance.add(data);
    return {...data, objectId: id};
  }

  async update(data, where) {
    const list = await this.model(this.tableName).where(this.parseWhere(where)).select();
    return Promise.all(list.map(item => {
      const updateData = typeof data === 'function' ? data(item) : data;
      return this.model(this.tableName).where({id: item.id}).update(updateData);
    }));
  }

  async delete(where) {
    const instance = this.model(this.tableName);
    return instance.where(this.parseWhere(where)).delete();
  }
}