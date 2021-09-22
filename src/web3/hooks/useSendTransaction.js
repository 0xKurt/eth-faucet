import { useConnectedAccount, useConnectedWeb3, useReadState, useTriggerEvent } from ".";
import { wait } from "../utils/func";
const emitter = require('events').EventEmitter;

const useSendTransaction = () => {
  const { web3, } = useConnectedWeb3();
  const { account, } = useConnectedAccount();
  const network = useReadState('network');
  const { event, trigger } = useTriggerEvent();
  const contractAddress = useReadState('contract')

  const domainType = [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" }
  ];
  const metaTransactionType = [
    { name: "nonce", type: "uint256" },
    { name: "from", type: "address" },
    { name: "functionSignature", type: "bytes" }
  ];
  const domainData = {
    name: "EthFaucet",
    version: "1",
    chainId: "4",
    verifyingContract: contractAddress
  };

  const signData = async (web3, fromAddress, typeData) => {
    return new Promise(function (resolve, reject) {
      web3.currentProvider.sendAsync(
        {
          id: 1,
          method: "eth_signTypedData_v4",
          params: [fromAddress, typeData],
          from: fromAddress,
        },
        function (err, result) {
          if (err) {
            // console.log(err)
            //reject(err); //TODO
          } else {
            const r = result.result.slice(0, 66);
            const s = "0x" + result.result.slice(66, 130);
            const v = Number("0x" + result.result.slice(130, 132));
            // console.log("r: " + r);
            // console.log("s: " + s);
            // console.log("v: " + v);

            resolve({
              v,
              r,
              s,
            });
          }
        }
      );
    });
  };

  const createMessageDataProxy = async (data, contract) => {
    let nonce = await contract.methods.getNonce(account).call();

    const message = {
      nonce: nonce,
      from: account,
      functionSignature: data
    }

    const typedData = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType
      },
      primaryType: "MetaTransaction",
      domain: domainData,
      message: message
    });

    // console.log('typed data')
    // console.log(typedData)
    return {
      typedData,
      message,
    };
  }

  const signTransfer = async (messageData) => {
    const sig = await signData(web3, account, messageData.typedData);
    // console.log("exec messageData: ")
    // console.log(messageData);
    // console.log("sig: ");
    // console.log(sig);
    return Object.assign({}, sig, messageData.message);
  };


  const onHashReceived = async (e, hash, txData) => {
    e.emit('transactionHash', hash);
    let receipt = null;
    let counter = 0;
    console.log('Hash:')
    console.log(hash)
    console.log('receipt')
    while ((receipt = await web3.eth.getTransactionReceipt(hash)) === null) { // wait for receipt
      await wait(10).then(() => {
        if (counter++ > 100) {
          e.emit('error', 'no receipt')
          return;
        }
      })
    }
    console.log(receipt)
    e.emit('receipt', receipt);

    let block = receipt.blockNumber;
    let confirmedBlock = block + (txData.confirmations ? txData.confirmations : 4)
    let latestBlock = block;
    console.log('confirmation')
    while (latestBlock <= confirmedBlock) { // wait for confirmations
      await wait(15).then(async () => {
        let fullBlock = await web3.eth.getBlock("latest")
        latestBlock = fullBlock.number;
      })
      console.log(latestBlock - block+'/'+confirmedBlock-block)
    }

    await web3.eth.clearSubscriptions()
    e.emit('confirmation', latestBlock - block);
    trigger();
  }


  const internalSend = async (txData, e) => {
    const contract = await new web3.eth.Contract(txData.abi, txData.address);
    const data = await contract.methods.sendEther().encodeABI();

    let messageData = await createMessageDataProxy(data, contract);
    let transfer = await signTransfer(messageData);
    const mtxData = contract.methods.executeMetaTransaction(transfer.from, transfer.functionSignature, transfer.r, transfer.s, transfer.v).encodeABI();
    const args = { from: account, to: contract._address, data: mtxData }

    if (web3) {
      // console.log('args')
      // console.log(args)
      try {
        console.log('send meta transaction to network')
        await web3.eth.sendTransaction(args)
          .on("transactionHash", async (hash) => {
            onHashReceived(e, hash, txData)
          }).catch(error => {
            e.emit('error', error)
            web3.eth.clearSubscriptions()
          })
      } catch (error) {
        e.emit('error', error)
        web3.eth.clearSubscriptions()
      }
    } else {
      e.emit('error', 'user not connected')
      web3.eth.clearSubscriptions()
    }
  }

  const send = (txData) => {
    let e = new emitter();
    internalSend(txData, e)
    return e;
  }

  return (send);
}

export default useSendTransaction;