import { Component } from 'react'
import ContractService from '../../services/contractService.js';

import { testTokenAbi } from '../../TestToken.js';
import { constants } from '../../constants.js';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import TransferForm from './TransferForm.js';


class TransferRoot extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.fetchBlockchainData(this.state.account)
  }


  async fetchBalance(account, contract) {
    const balance = {
      dev: await ContractService.dev.getBalance(contract, account.address),
      eth: await ContractService.eth.getBalance(account.address)
    };
    this.setState({ balance: balance })
  }

  fetchTransactionInfo = async (txId) => {
    const web3 = ContractService.web3;
    return await web3.eth.getTransaction(txId);
  }

  async fetchBlockchainData(myaccount) {
    const web3 = ContractService.web3;
    const contract = new web3.eth.Contract(testTokenAbi, constants.dev.address, { from: myaccount.address });
    await this.fetchBalance(myaccount, contract);
    this.setState({ contract: contract })
    this.setState({ initialized: true })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: JSON.parse(localStorage.getItem('account')),
      to: props.match.params.address,
      amount: props.match.params.amount,
      initialized: false
    }
  }

  fetchTransactionInfo = async (txId) => {
    const web3 = ContractService.web3;
    return await web3.eth.getTransaction(txId);
  }

  metamaskTransferEth = async (to, amount) => {
    const web3 = ContractService.web3;
    const account = this.state.account;
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await web3.eth.estimateGas({ from: account.address });
    const value = web3.utils.toWei(amount, "ether");
    const transactionParameters = {
      from: account.address,
      to: to,
      value: web3.utils.toHex(value),
      gasLimit: web3.utils.toHex(gasEstimate),
      gasPrice: web3.utils.toHex(gasPrice),
    }

    const res = await ContractService.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    }).catch(ex=>{
      return {state: 'error', method: 'eth_sendTransaction', message: ex.message}
    })
    const tx = await this.fetchTransactionInfo(res).catch(ex=>{
      return {state: 'error', method: 'fetchTransactionInfo', message: ex.message}
    });
    if(tx){
      const info = await web3.eth.getTransactionReceipt(tx.hash).catch(ex=>{
        return {state: 'error', method: 'getTransactionReceipt', message: ex.message}
      });
      if(info){
        this.fetchBalance(this.state.account, this.state.contract)
      }
    }
    return {state: 'fullfilled'};
  }

  metamaskTransferToken = async (to, amount) => {
    const web3 = ContractService.web3;
    const contract = this.state.contract;
    const account = this.state.account;
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await contract.methods.transfer(to, amount).estimateGas({ from: account.address });
    const value = web3.utils.toWei(amount, "ether");
    const transactionParameters = {
      from: account.address,
      to: contract._address,
      value: "0x0",
      gasLimit: web3.utils.toHex(gasEstimate),
      gasPrice: web3.utils.toHex(gasPrice),
      data: contract.methods.transfer(to, value).encodeABI(),
    }


    const res = await ContractService.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    }).catch(ex=>{
      return {state: 'error', method: 'eth_sendTransaction', message: ex.message}
    })
    const tx = await this.fetchTransactionInfo(res).catch(ex=>{
      return {state: 'error', method: 'fetchTransactionInfo', message: ex.message}
    });
    if(tx){
      const info = await web3.eth.getTransactionReceipt(tx.hash).catch(ex=>{
        return {state: 'error', method: 'getTransactionReceipt', message: ex.message}
      });
      if(info){
        this.fetchBalance(this.state.account, this.state.contract)
      }
    }
    return {state: 'fullfilled'};


  }

  directTransfer = async (to, amount) => {
    const web3 = ContractService.web3;
    const contract = this.state.contract;
    const account = this.state.account;
    const gasPrice = await web3.eth.getGasPrice();
    const value = web3.utils.toWei(amount, "ether");
    const gasEstimate = await contract.methods.transfer(to, value).estimateGas({ from: account.address });
    const res = await contract.methods.transfer(to, value)
      .send({ from: account.address, gasPrice: gasPrice, gas: gasEstimate })
      .catch(ex=>{
        return {state: 'error', method: 'eth_sendTransaction', message: ex.message}
      })
      const tx = await this.fetchTransactionInfo(res.transactionHash).catch(ex=>{
        return {state: 'error', method: 'fetchTransactionInfo', message: ex.message}
      });
      if(tx){
        const info = await web3.eth.getTransactionReceipt(tx.hash).catch(ex=>{
          return {state: 'error', method: 'getTransactionReceipt', message: ex.message}
        });
        if(info){
          this.fetchBalance(this.state.account, this.state.contract)
        }
      }
      return {state: 'fullfilled'};
  }


  render() {

    return !this.state.initialized ? <div />
      : <div>
        From: {this.state.account.address}
        <TransferForm
          amount={this.state.amount}
          to={this.state.to}
          balance={this.state.balance}
          account={this.state.account}
          contract={this.state.contract} title="Metamask transfer ETH" name="eth"
          sendHandler={this.metamaskTransferEth}

        />
        {
          (!this.state.to) ?
            <div>
              <br />
              <TransferForm balance={this.state.balance}
                account={this.state.account}
                contract={this.state.contract}
                title="Metamask transfer DEV" name="dev"
                sendHandler={this.metamaskTransferToken}
              />
              <br />
              <TransferForm balance={this.state.balance}
                account={this.state.account}
                contract={this.state.contract}
                itle="Direct transfer DEV" name="dev"
                sendHandler={this.directTransfer}
              />
            </div>
            : <div />

        }
      </div>
  }
}


export default withRouter(TransferRoot);
