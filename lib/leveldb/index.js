const util = require('util')
const uuid = require('uuid')
const json = require('json')
const fs = require('fs')
const path = require('path')
const db = require("db")

const config = require("../../config")
console.log(config)
const level_path = path.join(config.db.workspace, 'leveldb')
if (!fs.exists(level_path)) fs.mkdir(level_path)

const dbs = {}

// function LevelDB (space) {
//   if(!util.has(dbs, space)) dbs[space] = new db.openLevelDB(path.join(level_path, space))
//   return dbs[space]
// }

function filter (buf) {
  if (util.isNull(buf)) {
    // 此处 typeof buf 是 object
  } else if (util.isBuffer(buf)) {
    buf = buf.toString()
    if (buf[0] === '[' || buf[0] === '{') {
      buf = json.decode(buf)
    }
  } else if (util.isObject) {
    buf = json.encode(buf)
  } else if (buf) {
    buf = buf.toString()
  }
  console.log(buf)
  return buf

}

module.exports = (space) => {
  if(!util.has(dbs, space)) dbs[space] = new LevelDB(space)
  return dbs[space]
}

module.exports.clear = (space) => {
  if (util.has(dbs, space)) {
    dbs[space].close()
    fs.readdir(path.join(level_path, space)).forEach(s => fs.unlink(path.join(level_path, space, s)))
    fs.rmdir(path.join(level_path, space))
    dbs = util.omit(dbs, space)    
  }
}

class LevelDB {
  constructor (space) {
    this.dir = path.join(level_path, space)
    this.db = new db.openLevelDB(this.dir)
  }

  filter (buf) {
    if (util.isNull(buf)) {
      // 此处 typeof buf 是 object
    } else if (util.isBuffer(buf)) {
      buf = buf.toString()
      if (buf[0] === '[' || buf[0] === '{') {
        buf = json.decode(buf)
      }
    } else if (util.isObject) {
      buf = json.encode(buf)
    } else if (buf) {
      buf = buf.toString()
    }
    return buf
  }

  has (key) {
    return this.db.has(key)
  }

  ['get'] (key) {
    return this.filter(this.db.get(key))
  }

  mget (keys) {
    return this.db.mget(keys).map(this.filter)
  }

  ['set'] (key, value) {
    this.db.set(key, this.filter(value))
    return this
  }

  mset (map) {
    const self = this
    this.db.mset(util.reduce(map, (newMap, val, key) => {
      newMap[key] = self.filter(val)
      return newMap
    }, {}))
    return this
  }

  remove (key) {
    this.db.remove(key)
    return this
  }

  mremove (keys) {
    this.db.mremove(keys)
    return this
  }

  forEach (callback) {
    this.db.forEach((val, key) => callback(this, this.filter(val), key))
    return this
  }

  between (from, to, callback) {
    this.db.between(from, to, (val, key) => callback(this.filter(val), key))
  }

  trans (callback) {
    try {
      this.db.begin()
      callback(this)
      this.db.commit()
    } catch (e) {
      this.db.close()
    }
  }

  close () {
    this.db.close()
  }
}

exports.has = (space, key) => LevelDB(space).has(key)

exports.get = (space, key) => filter(LevelDB(space).get(key))
exports.mget = (space, keys) => LevelDB(space).mget(keys).map(filter)

exports.set = (space, key, value) => LevelDB(space).set(key, filter(value))
exports.mset = (space, map) => LevelDB(space).mset(util.reduce(map, (newMap, val, key) => {newMap[key] = filter(val); return newMap;}, {}))

exports.remove = (space, key) => LevelDB(space).remove(key)
exports.mremove = (space, keys) => LevelDB(space).mremove(keys)

exports.forEach = (space, callback) => LevelDB(space).forEach((val, key) => callback(filter(val), key))
exports.between = (space, from, to, callback) => LevelDB(space).between(from, to, (val, key) => callback(filter(val), key))
exports.begin = (space) => LevelDB(space).begin()
exports.commit = (space) => LevelDB(space).commit()
exports.close = (space) => LevelDB(space).close()



