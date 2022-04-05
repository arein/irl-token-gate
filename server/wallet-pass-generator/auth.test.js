const auth = require('./auth');

describe('Authn Test', () => {
    it('should login', (done) => {
        auth.isOwner(
            '0x5a23911bed6cb010912ce4b64a5d90418579b445e36fcd9182b5aac97bf92a6c069d126af9df61d24c69b430e6511b057e5e6c28a45854603320c9b544c418501b',
            '0xf3ea39310011333095CFCcCc7c4Ad74034CABA63', 990
        ).then((isAuthed) => {
            console.log(isAuthed);
            done();
        }).catch((err) => {
            done(err);
        });
    });
});