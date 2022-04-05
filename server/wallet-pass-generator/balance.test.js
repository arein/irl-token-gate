const assert = require('assert');
const expect = require('chai');
const balance = require('./balance');


describe('Balance Test', () => {
    it('should get the balance', (done) => {
        balance.getBalance('0x7f6fECB0D79fC1B325ae064788bf3c0e6dE8e35B', '0xf3ea39310011333095CFCcCc7c4Ad74034CABA63').then((balance) => {
            console.log(balance);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});