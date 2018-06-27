// SQLite3
// -------
const path = require('path')
const config = require('../../config')
const Db = require('db')
const Pool = require('../pool')

class Database {
  constructor () {
    const db_path = path.join(config.db.workspace, 'zhuxi.db')
    console.log(db_path)

    this.pool = Pool({
      create: () => Db.open(`sqlite:${db_path}`),
      destroy: o => o.close(),
      timeout: 30 * 1000,
      retry: 3
    });
  }

  static getInstance () {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  query (sql, conn) {
    console.log(sql)
    let result
    if (!conn) {
      this.pool(conn => result = conn.execute(sql))
    } else {
      result = conn.execute(sql)
    }
    return result

  }
}

module.exports = Database.getInstance()

