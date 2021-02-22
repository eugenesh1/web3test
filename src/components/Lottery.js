import React, { Component } from 'react'

import {lotteryAbi} from './../Lottery.js';
import  ContractService  from '../services/contractService.js';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import {constants} from './../constants.js';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";



const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  
  to: {width: '500px'},
  buttonPanel: {
      justifyContent: 'center',
      display: 'flex'
  }      
}));

function LotteryInfo(props) {
  const history = useHistory();
  const classes = useStyles();
    
  const handleClickPlayBtn = () => {
      history.push(constants.mainMenu.transfer.path+"/"+props.contract._address+"/"+constants.lottery.minimalAmount)
  }    
    
  return (
      <div>
          <Paper variant="outlined" square className={classes.root}>
                    <div >
                        <h4>
                            <div>{props.title}</div> 
                            <div>Lottery address: {props.contract._address}</div>
                            <div>Lottery pool balance: {props.balance[props.name]/10**18} eth</div>
                            <div>Players: {props.players.length}</div>
                        </h4>
                        <div className={classes.buttonPanel}>
                            <Button variant="contained"  color="primary" onClick={handleClickPlayBtn}>Play</Button>
                        </div>
                    </div>
                </Paper>
          </div>
  );
}

class Lottry extends Component {
 
  componentWillMount() {
        this.fetchBlockchainData(this.state.account)
    }

    constructor(props) {
        super(props)  
        this.state = { account: JSON.parse(localStorage.getItem('account')), initialized: false } 
    }

      
    async fetchBalance(contract){
        const balance = {
            lottery: await ContractService.lottery.getBalance(contract._address),
        };
        this.setState({ balance: balance })
    }   
    
  async fetchBlockchainData(myaccount) { 
    const web3 = ContractService.web3;
    const contract = new web3.eth.Contract(lotteryAbi, constants.lottery.address, {from: myaccount.address});
    const players = await ContractService.lottery.getPlayers(contract);
    await this.fetchBalance(contract);
    this.setState({ account: myaccount })
    this.setState({ contract: contract })
    this.setState({ players: players })
      
    this.setState({ initialized: true })
      
  }
 

  render() {
    return (
        (this.state.initialized)?
      <div>
        <LotteryInfo players={this.state.players} account={this.state.account} name="lottery" balance={this.state.balance} 
        contract={this.state.contract}/>
      </div>
        :
        <div/>
    );
  }
}

export default Lottry;
