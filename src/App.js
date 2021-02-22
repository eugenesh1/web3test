import React, { Component } from 'react'
import './App.css'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from "react-router-dom";

import  Home  from "./components/Home";
import  Settings  from "./components/Settings";
import  Admin  from "./components/Admin";
import  Login  from "./components/Login";
import  Lottery  from "./components/Lottery";
import  PrivateRoute  from "./PrivateRoute";
import {constants} from './constants.js';

import {Route } from "react-router-dom";
import { fakeAuth } from './components/Login';
import TransferRoot from './components/transfer/TransferRoot';
import Web3 from 'web3'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

function PersistentDrawerLeft(props) {
    
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [menu] = React.useState(
    Object.values(constants.mainMenu)
  );
  const [activeMenu, setActiveMenu] = React.useState({});
      
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

 const handleMenuClick = (menu) => {
    setActiveMenu(menu);
     if(menu.path)
        history.push(menu.path);
     if(menu.onclick)
         menu.onclick(fakeAuth)
  }
    
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {activeMenu.text}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {menu.map((menu) => (
            <ListItem button key={menu.id} onClick={()=>handleMenuClick(menu)}>
              <ListItemText to={menu.path} id={menu.id} primary={menu.text}/>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        
            <div>
                  <PrivateRoute exact path="/admin" component={Admin} />
                  <Route exact path="/"><Home /></Route>
                  <Route path="/home"><Home /></Route>  
                  <PrivateRoute exact path="/transfer" component={TransferRoot}/>
                  <PrivateRoute exact path="/transfer/:address/:amount" component={TransferRoot}/ >
                  <Route path="/settings"><Settings /></Route>
                  <PrivateRoute path="/lottery" component={Lottery}/>

                  <Route path="/login"><Login /></Route>
            </div>
      
      </main>
    </div>
  );
}

class App extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      accountAddress:  null
    }
    
      if (window.web3) {    
          window.web3 = new Web3(window.ethereum);    
          window.ethereum.send('eth_requestAccounts').then(response=>{
              console.log(response)
              this.setState({initialized: true})
          }).catch(ex=>{
            this.setState({initialized: false})
          })
          
      }
  }
  
  render() {
    return (
      (this.state.initialized)? <PersistentDrawerLeft />:<div>Please install MetaMask to use this dApp!</div>
    );
  }
}
 export default  App;
