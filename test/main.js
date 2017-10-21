const assert = require('assert');
const MD5 = require('../dist/md5algorithm.min').default;

describe('MD5', function () {
    it('should test "Hello, World!"', function () {
        let text = 'Hello, World!';
        assert.equal(MD5.hash(text), '65A8E27D8879283831B664BD8B7F0AD4');
    });

    it('should test "你好"', function () {
        let text = '你好';
        assert.equal(MD5.hash(text), '7ECA689F0D3389D9DEA66AE112E5CFD7');
    });
});