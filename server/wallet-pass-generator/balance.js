var Web3 = require('web3');
var Web3Client = new Web3(new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/1c96603e022b4d97a08b70a95afae845"));
var abi = require('./abi');


const getBalance = (tokenAddress, walletAddress, decimals) => {
    const contract = new Web3Client.eth.Contract(abi.abi, tokenAddress);
    return new Promise((resolve, reject) => {
        contract.methods.balanceOf(walletAddress).call().then((result) => {
            const format = Web3Client.utils.fromWei(result);
            return resolve(parseInt(result / Math.pow(10, decimals)));
        }).catch((error) => reject(error));
    });
};

module.exports.getBalance = getBalance;