module.exports = {
    setup: (conn, opts) => {},
    get: (conn, opts, k) => {
        var v = conn.get(k);
        return v === undefined ? null : v;
    },
    set: (conn, opts, k, v) => conn.set(k, v),
    has: (conn, opts, k) => conn.has(k),
    keys: (conn, opts) => Object.keys(conn.toJSON()),
    renew: (conn, opts, k) => conn.set(k, conn.get(k)),
    remove: (conn, opts, k) => conn.delete(k),
};