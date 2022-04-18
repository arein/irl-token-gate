const { Template } = require("@walletpass/pass-js");
var fs = require('fs');

const passKeyPw = process.env.PRIVATE_KEY_PW;

const getPass = (address) => {
    return new Promise((resolve, reject) => {
        try {
            const template = new Template("storeCard", {
                passTypeIdentifier: "pass.com.dereks.angels.gate",
                teamIdentifier: "Q338UYGFZ8",
                backgroundColor: "white",
                organizationName: "DereksAngels",
                logoText: "Blackdove",
                sharingProhibited: true
            });
            template.setCertificate(fs.readFileSync(__dirname + "/keys/cert.pem").toString());
            template.setPrivateKey(fs.readFileSync(__dirname + "/keys/key.pem").toString(), passKeyPw);
            const pubKey = fs.readFileSync(__dirname + "/keys/encryptionPublicKey.pem").toString().replace("\n", "");

            Promise.all([
                template.images.add("icon", fs.readFileSync(__dirname + "/Event.pass/icon.png")),
                template.images.add("logo", fs.readFileSync(__dirname + "/Event.pass/logo.png")),
                template.images.add("background", fs.readFileSync(__dirname + "/Event.pass/background.png")),
                template.images.add("icon", fs.readFileSync(__dirname + "/Event.pass/icon@2x.png"), "2x"),
                template.images.add("logo", fs.readFileSync(__dirname + "/Event.pass/logo@2x.png"), "2x"),
                template.images.add("background", fs.readFileSync(__dirname + "/Event.pass/background@2x.png"), "2x")
            ]).then(() => {
                const pass = template.createPass({
                    serialNumber: "123457",
                    description: "Token Gate",
                    nfc: {
                        message: address,
                        encryptionPublicKey: pubKey
                    }
                });
                pass.asBuffer().then((buffer) => {
                    resolve(buffer);
                }).catch((err) => {
                    reject(err);
                });
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports.getPass = getPass;