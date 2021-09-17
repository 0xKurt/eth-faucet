import React, { useEffect, useState } from 'react';
import { GiWaterRecycling } from 'react-icons/gi'
import { IconContext } from "react-icons"
import { useEthBalanceOf, useConnectedAccount, useCallContract, useReadState } from '../web3/hooks'
import { ConnectButton, TransactionButton } from '../web3/components'
const ABI = [{ "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "userAddress", "type": "address" }, { "indexed": false, "internalType": "address payable", "name": "relayerAddress", "type": "address" }, { "indexed": false, "internalType": "bytes", "name": "functionSignature", "type": "bytes" }], "name": "MetaTransactionExecuted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "Received", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "", "type": "uint256" }], "name": "Send", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "userAddress", "type": "address" }, { "internalType": "bytes", "name": "functionSignature", "type": "bytes" }, { "internalType": "bytes32", "name": "sigR", "type": "bytes32" }, { "internalType": "bytes32", "name": "sigS", "type": "bytes32" }, { "internalType": "uint8", "name": "sigV", "type": "uint8" }], "name": "executeMetaTransaction", "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "sendEther", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "stateMutability": "payable", "type": "receive" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "alreadyUsed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getNonce", "outputs": [{ "internalType": "uint256", "name": "nonce", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]

//const ADDRESS = '0xdD141ff2bB223006552cc30EA686196fDDCdDF07'

const Faucet = () => {
  const ADDRESS = useReadState('contract')
  
  const { account, } = useConnectedAccount();
  const ethBalance = useEthBalanceOf(account);
  const { callResult, call } = useCallContract();
  const [used, setUsed] = useState('')
  const balance = useEthBalanceOf(ADDRESS);

  useEffect(() => {
    if (account) {
      call({
        address: ADDRESS,
        abi: ABI,
        method: 'alreadyUsed',
        args: [account]
      }).then(() => {
       // console.log('call')
       // console.log()
        setUsed(Boolean(parseInt(callResult)))
      })
    }

  })

  return (
    <div className='page'>
      <div style={{ color: 'dodgerblue', marginTop: '50px', fontSize: '1.8rem' }}><IconContext.Provider value={{size: '1.6rem'}}><GiWaterRecycling /> Rinkeby Testnet Faucet <GiWaterRecycling /></IconContext.Provider></div>
      <div style={{ fontSize: '0.7rem' }}>Faucet address: {ADDRESS}</div>
      <div style={{ fontSize: '0.6rem' }}>Any problems? Feel free to dm me on <a href='https://www.reddit.com/user/k_ekse' target='_blank'>reddit</a></div>
      <div style={{ marginTop: '20px', fontSize: '1.4rem' }}>Current balance: {balance} rETH</div>
      <div style={{ marginTop: '30px', fontWeight: '700', fontSize: '1rem'}}>You are able to receive 0.2 rETH if:</div>
      <div style={{ fontSize: '0.8rem' }} > &#8226;&nbsp; your current rETH balance is below 0.2 rETH{account ? (ethBalance >= 0.2 ? <span>&nbsp;&nbsp;&#x274C;</span> : <span style={{ fontSize: '1.4rem', color: '#28a745' }}>&nbsp;&#10003;</span>) : <></>}</div>
      <div style={{ fontSize: '0.8rem' }}> &#8226;&nbsp; and you have not used this faucet before{account ? (used ? <span>&nbsp;&nbsp;&#x274C;</span> : <span style={{ fontSize: '1.4rem', color: '#28a745' }}>&nbsp;&#10003;</span>) : <></>}</div>
      <div style={{ marginTop: '50px' }}><center><ConnectButton /></center></div>
      <div style={{ fontSize: '0.6rem' }}>Connect your wallet to receive 0.2 rETH</div>
      <div style={{ marginTop: '50px' }}>
        <center>
          <TransactionButton
            text={'Send me some ETH :D'}
            address={ADDRESS}
            abi={ABI}
            method={'sendEther'}
            args={[]}
            confirmations={1} //optional
          />
        </center>
      </div>

    </div>
  );
}

export default Faucet;