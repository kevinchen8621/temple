/**
 * Really should never fail unless run with the browser tests
 */
var test = require('test');
test.setup();

var assert  = require('assert');

describe('Normalize', function(){
  it ('should have defined Buffer', function(){
    assert.equal( typeof Buffer, 'function' );
  });
});

test.run(console.DEBUG);