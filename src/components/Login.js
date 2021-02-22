import React, { useState } from "react";
import { Redirect, useLocation } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import  ContractService  from '../services/contractService.js';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(2),
    },
  },
  
  pk: {width: '700px'}
}));

export default function Login() {
  const { state } = useLocation();
  const [ pk, setPk ] = useState();
  const { from } = state || { from: { pathname: "/" } };
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  const classes = useStyles(); 
    
  const unlock = () => {
    fakeAuth.authenticate(() => {
        const web3 = ContractService.web3;
        const myaccount = web3.eth.accounts.privateKeyToAccount('0x' + pk);
        web3.eth.accounts.wallet.add(myaccount);
        web3.eth.defaultAccount = myaccount.address;
        localStorage.setItem('account', JSON.stringify(myaccount));
        setRedirectToReferrer(true);
    });
      
  };
    
  if (redirectToReferrer) {
    return <Redirect to={from} />;
  }
 
  const handleChangePk = (e) => {
    setPk(e.target.value);
  }

  return (
    <div className={classes.root} >
      <TextField className={classes.pk} label="Private key" onChange={handleChangePk} />     
      <Button onClick={unlock} >Unlock account</Button>
    </div>
  );
}

/* A fake authentication function */
export const fakeAuth = {
  isAuthenticated: localStorage.getItem('account')!==null,
  authenticate(cb) { 
    this.isAuthenticated = true;  
    setTimeout(cb, 100);
  },
  lock(cb) { 
    this.isAuthenticated = false;  
    setTimeout(cb, 100);
  },   
    
};
