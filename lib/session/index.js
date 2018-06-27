const uuid = require('uuid')
const encoding = require('encoding')
const json = encoding.json
const fs = require('fs')
const path = require('path')
const db = require("db")



function cookie_filter (r) {
  r.sid = r.cookies.sid || uuid.snowflake().hex()
  r.response.addCookie({name: 'sid', value: r.sid})
  r.session = (cat, data) => {
    const key = cat === 'user' ? r.sid : cat
    if (data) {
      SessionStore.set(key, json.encode(data))
    } else {
      let result = SessionStore.get(key)
      return result ? json.decode(result) : null
    }
  }
  r.logout = () => {
    SessionStore.remove(r.sid)    
  }
}

module.exports = { cookie_filter }
