
'use strict';

const { RPCClient } = require('./pop-core');

function hasOwnProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

class Client extends RPCClient {
  constructor(config) {
    config.apiVersion = '2017-05-25';
    super(config);
  }

  queryTokenForMnsQueue(params = {}, options) {
    if (!hasOwnProperty(params, 'MessageType')) {
      throw new TypeError('parameter "MessageType" is required');
    }

    return this.request('QueryTokenForMnsQueue', params, options);
  }

}

module.exports = Client;