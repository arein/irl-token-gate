import './App.css';

import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import React from 'react';
import abi from './abi';
import {supportedTokens, infuraId, endpoint} from './const';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: infuraId
    }
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet",
  providerOptions,
  theme: "dark"
});


function App() {
  const [isConnected, setIsConnected] = React.useState(false);
  const [balance, setBalance] = React.useState(0);
  const [provider, setProvider] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [selectedToken, setSelectedToken] = React.useState(supportedTokens.length < 2 ? {name: supportedTokens[0].name, decimals: supportedTokens[0].type === 'ERC20' ? supportedTokens[0].decimals : 0, address: supportedTokens[0].address} : null);
  const [nonce, setNonce] = React.useState(null);

  // Prepending with safari forces to open link in Safari
  const isIphone = navigator.userAgent.toLowerCase().includes('iphone');
  const passUrl = `${endpoint}/serverless_lambda_stage/generate?wallet=${selectedAccount}&nonce=${nonce}&token=${selectedToken && selectedToken.address}&decimals=${selectedToken && selectedToken.decimals}`;
  const disconnectWallet = (() => {
    console.log("Killing the wallet connection", provider);
    setSelectedToken(null);
    if (provider.close) {
      provider.close().then(() => {
        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        web3Modal.clearCachedProvider();
        setProvider(null);
        setIsConnected(false);
      });
    } else {
      web3Modal.clearCachedProvider();
      setProvider(null);
      setIsConnected(false);
    }
  
    setSelectedAccount(null);
  });
  const connectWallet = (() => {
    if (web3Modal.cachedProvider) {
      web3Modal.clearCachedProvider();
    }
    web3Modal.connect().then((provider) => {
      setProvider(provider);
      const web3 = new Web3(provider);
      setWeb3(web3);
      setIsConnected(true);
      const tokenInst = new web3.eth.Contract(abi, selectedToken.address);
      web3.eth.getAccounts().then((accs) => {
        const selectedAccount = accs[0];
        setSelectedAccount(selectedAccount);
        tokenInst.methods.balanceOf(selectedAccount).call().then((result) => {
          console.log('balanceof', result, parseInt(result/10^selectedToken.decimals), selectedToken.decimals, Math.pow(10, selectedToken.decimals));
          setBalance(parseInt(result/Math.pow(10, selectedToken.decimals)));
        });
      });
    });
  });
  const getWalletPass = () => {
    web3.eth.personal.sign(`I own ${balance} ${selectedToken.address} tokens`, selectedAccount).then((nonce) => {
      setNonce(nonce);
    });
  };
  const openLink = () => {
    window.open(passUrl, "_self");
  };
  const metamaskUrl = 'https://metamask.app.link/dapp/' + window.location.href.replace('https://', '');
  const tokenOptions = supportedTokens.map((token, idx) => {
    return <option key={token.address} value={idx}>{token.name}</option>;
  });
  
  return (
    <div className="App">
      {!isIphone &&
        <div>
          <span>WARNING: You're not on an iPhone. This app only works on iPhones :(</span>
          <br/>
        </div>
      }
      {!isConnected &&
      <div>
        <h1>Create an Apple NFC Pass</h1>
      </div>
      }
      {!selectedToken && <form>
        <div class="form-group">
          <label for="exampleFormControlSelect1">Supported ERC20/ERC721 Tokens</label>
          <select class="form-control" id="exampleFormControlSelect1" onChange={(event) => {
            if (event.target.value === '') return;
            const idx = parseInt(event.target.value);
            const token = supportedTokens[idx];
            setSelectedToken({name: token.name, decimals: token.type === 'ERC20' ? token.decimals : 0, address: token.address})
          }}>
            <option value="">Select a Token you own</option>
            {tokenOptions}
          </select>
        </div>
      </form>}
      {!isConnected && selectedToken &&
      <div><button className="btn btn-primary" onClick={connectWallet}>
        Connect Wallet
      </button>
      <br/>
      <a target="_blank" rel="noreferrer" href={metamaskUrl}>
        Open in Metamask Mobile Wallet
      </a>
      </div>
      }
    {isConnected &&
      <button className="btn btn-primary" onClick={disconnectWallet}>
        Disconnect Wallet
      </button>
      }
      {isConnected && balance >= 1 && !nonce &&
        <div>
          <span>Congrats. You own {balance} {selectedToken.name}. Get your Apple Wallet pass.</span>
          <br/>
          <button className="btn btn-primary" onClick={getWalletPass}>
            Get your Apple Wallet Card
          </button>
        </div>
      }

      {isConnected && balance >= 1 && nonce &&
        <div>
          <a target="_blank" rel="noreferrer" href={passUrl}>
            Download Pass
          </a>
        </div>
      }

      {isConnected && balance < 1 &&
        <span>Sorry babe you dont own any of the supported tokens.</span>
      }
    </div>
  );
}

export default App;

