const util = require('util')
const Database = require('./database')

class Client {
  constructor (tableName) {
    this.tableName = tableName
  }

  pool (callback) {
    const self = this
    Database.pool(cnn => callback(self, cnn))
  }

  create (attributes, connection) {
    let primarys = []
    const columns = []
    for (let key in attributes) {
      let val = attributes[key]
      if (util.isString(val)) val = { type: val }
      if (val.primary) primarys.push(key)
      if (val.type === 'integer') {
        columns.push(`${key} integer ${val.null ? '' : 'not null'}`)
      } else if (val.type === 'text') {
        columns.push(`${key} text ${val.null ? '' : 'not null'}`)
      } else if (val.type = 'real') {
        columns.push(`${key} real ${val.null ? '' : 'not null'}`)
      } else if (val.type = 'blob') {
        columns.push(`${key} blob ${val.null ? '' : 'not null'}`)
      }
    }
    columns.push(`ins_at integer not null`)  
    columns.push(`upd_at integer not null`)  
    columns.push(`del_at integer not null`)
    if (primarys.length === 0) {
      columns.unshift(`id integer not null primary key autoincrement`)
    } else {
      columns.push(`primary key (${primarys.join(', ')})`)
    }
    Database.query(`create table if not exists ${this.tableName}(\n\t${columns.join(', \n\t')}\n);`, connection)
    return this
  }

  drop (connection) {
    Database.query(`drop table if exists ${this.tableName};`, connection)
    return this  
  }

  insert (data, connection) {
    if(util.isArray(data)) return util.map(data, item => this.insert(item, connection))
    let fields = [], values = []
    data.ins_at = new Date()
    data.upd_at = new Date()
    data.del_at = 0
    util.each(data, (val, key) => {
      fields.push(key)
      if (util.isNumber(val)) {
        values.push(val)
      } else if (util.isDate(val)) {
        values.push(val.valueOf())
      } else if (util.isObject(val)) {
        values.push(`'${JSON.stringify(val).replace("'", "''")}'`)
      } else {
        values.push(`'${val.replace("'", "''")}'`)
      }
    })
    return Database.query(`insert or replace into ${this.tableName} (${fields.join(', ')}) values (${values.join(', ')});`, connection)  
  }

  update (where, values, connection) {
    let sets = []
    values.upd_at = new Date()
    util.each(values, (val, key) => {
      if (util.isNumber(val)) {
        sets.push(`${key} = ${val}`)
      } else if (util.isDate(val)) {
        sets.push(`${key} = ${val.valueOf()}`)
      } else if (util.isObject(val)) {
        sets.push(`${key} = '${JSON.stringify(val).replace("'", "''")}'`)
      } else {
        sets.push(`${key} = '${val.replace("'", "''")}'`)
      }
    })
    return Database.query(`update ${this.tableName} set ${sets.join(' ,')}) where ${this.where(where)};`, connection) 
  }

  delete (where, connection) {
    return Database.query(`update ${this.tableName} set del_at = ${(new Date()).valueOf()} where ${this.where(where)};`, connection)   
  }

  count (where, connection) {
    where.del_at = 0
    console.log(where)
    console.log(this.where(where))
    const record = Database.query(`select count(*) as num from ${this.tableName} where ${this.where(where)}`, connection)
    return record[0].num
  }

  paged (where, limit, page, total) {

  }

  find (where, options = {}, connection) {
    where.del_at = 0
    const params = {
      tableName: this.tableName,
      where: util.isEmpty(where) ? '' : 'where ' + this.where(where),
      fields: util.isEmpty(options.fields) ? '*' : util.isArray(options.fields) ? options.fields.join(' ,') : options.fields,
      sort: util.isEmpty(options.sort) ? '' : 'order by ' + this.sort(options.sort),
      groupBy: util.isEmpty(options.groupBy) ? '' : 'group by ' + (util.isArray(options.groupBy) ? options.groupBy.join(' ,') : options.groupBy),
      having: util.isEmpty(options.having) ? '' : 'having ' + this.where(options.having),
      distinct: options.distinct ? 'distinct' : '',
      limit: options.limit ? 'limit ' + options.limit : '',
      offset: options.offset ? 'offset ' + options.offset : '',
    }
    return Database.query(`select ${params.distinct} ${params.fields} from ${params.tableName} ${params.where} ${params.groupBy} ${params.having} ${params.sort} ${params.limit} ${params.offset}`, connection)  
  }

  findOne(where, options = {}, connection) {
    where.del_at = 0
    const params = {
      tableName: this.tableName,
      where: util.isEmpty(where) ? '' : 'where ' + this.where(where),
      fields: util.isEmpty(options.fields) ? '*' : options.fields.join(' ,'),
    }
    const result = Database.query(`select ${params.fields} from ${params.tableName} ${params.where} limit 1`, connection)
    return result.length > 0 ? result[0] : null
  }

  grouped(where, field, connection) {
    const result = Database.query(`select ${field}, count(*) as num from ${this.tableName} ${util.isEmpty(where) ? '' : 'where ' + this.where(where)} group by ${field}`, connection)
    return util.reduce(result, (memo, item) => {
      memo[item[field]] = item.num
      return memo
    }, {})
  }

  lookup(where, field, connection) {
    const result = Database.query(`select ${field} from ${this.tableName} ${util.isEmpty(where) ? '' : 'where ' + this.where(where)}`, connection)
    return util.map(result, item => item[field])
  }

  where (options) {
    return util.reduce(options, (result, val, key) => {
      if (key === '$or') {
        result.push('(' + val.map(item => this.where(item)).join(' or ') + ')')
      } else if (key === '$and') {
        result.push('(' + val.map(item => this.where(item)).join(' and ') + ')')
      } else if (util.isDate(val)) {
        result.push(`${key} = ${val.valueOf()}`)
      } else if (util.isNumber(val)) {
        result.push(`${key} = ${val}`)
      } else if (util.isString(val)) {
        result.push(`${key} = '${val}'`)
      } else if (util.isObject(val)) {
        result.push(util.reduce(val, (res, v, k) => {
          if (k === '$gt') res.push(`${key} > ${v}`)
          else if (k === '$gte') res.push(`${key} >= ${v}`)
          else if (k === '$lt') res.push(`${key} < ${v}`)
          else if (k === '$lte') res.push(`${key} <= ${v}`)
          else if (k === '$ne') res.push(`${key} != ${v}`)
          else if (k === '$like') res.push(`${key} like '%${v}%'`)
          else if (k === '$orlike') res.push('(' + util.map(v, itm => `${key} like '%${itm}%'`).join(' or ') + ')')
          else if (k === '$andlike') res.push('(' + util.map(v, itm => `${key} like '%${itm}%'`).join(' and ') + ')')
          return res
        }, []).join(' and '))
      }
      return result
    }, []).join(' and ')
  }

  sort (options) {
    return util.reduce(options, (result, val, key) => {
      result.push(val > 0 ? `${key}` : `${key} desc`)
      return result
    }, []).join(' ,')
  }
}

module.exports = tableName => new Client(tableName)
module.exports.trans = callback => Database.pool(cnn => callback(cnn))
