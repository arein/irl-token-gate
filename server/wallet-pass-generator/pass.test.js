const assert = require('assert');
const expect = require('chai');
const pass = require('./pass');


describe('Pass Generator Test', () => {
    it('should create a pass', (done) => {
        pass.getPass().then((buffer) => {
            done();
        }).catch((err) => {
            done(err);
        });
    });
});