import React from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  
  to: {width: '500px'}
}));

export default function TransferForm(props) {
  const classes = useStyles();   
  const [state, setState] = React.useState({
    amount: props.amount?props.amount:'',
    to: props.to?props.to:'',
    transaction: {}  
  });
    

     
  const handleClickSendBtn = async (e) => {
      setState({...state, "transaction": {'state': 'pending'}}); 
     
      const res = await props.sendHandler(state.to, state.amount)

        setState({...state, "transaction": res});
  }

  const handleChangeAmount = (e) => {
    setState({...state, "amount": e.target.value});
  }

  const handleChangeTo = (e) => {
    setState({...state, "to": e.target.value});
  }

  
  return (
      <div>
          <Paper variant="outlined" square className={classes.root}>
                    <div >
                    <h4>
                        <div>{props.title}</div> 
                        <div>Balance: {props.balance[props.name]/10**18} {props.name}</div>
                    </h4>
                    <form noValidate autoComplete="off" className={classes.root}>
                      <TextField className={classes.to} label="To" onChange={handleChangeTo} value={state.to}/>     
                      <TextField label="Amount" type="number" onChange={handleChangeAmount} value={state.amount}/>
                      <Button variant="contained" color="primary" onClick={handleClickSendBtn}>send</Button>
                    </form>
                    <p>{state.transaction.state}</p>
                    <p>{state.transaction.message}</p>
                     
                    </div>
                </Paper>
          </div>
  );
}