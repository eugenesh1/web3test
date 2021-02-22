import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const ContractService = {
    web3: web3,
    ethereum: window.ethereum,
    
    eth: {
        getBalance: web3.eth.getBalance
    },
    dev: {
       getBalance: function(contract, address){
            return contract.methods.balanceOf(address).call();
        }, 
    },    
    lottery: {
        getPlayers: function(contract){
            return contract.methods.getPlayers().call();
        },
        getBalance: web3.eth.getBalance
    }   
}

export default ContractService;
