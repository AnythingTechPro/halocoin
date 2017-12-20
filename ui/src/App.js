import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MSidebar from './components/sidebar.js';
import MNavbar from './components/navbar.js';
import MainPage from './MainPage.js';
import WalletManagement from './WalletManagement.js';
import ChooseWallet from './ChooseWallet.js';
import NotificationSystem from 'react-notification-system';
import io from 'socket.io-client';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "status": null
    }
    this.pageChanged = this.pageChanged.bind(this);
    this.checkDefault = this.checkDefault.bind(this);
    this.notify = this.notify.bind(this);
    this.pagesIcons = {
      "Dashboard": "dashboard",
      "Wallet Manager": "explore"
    }
    this.socket = io();
    this.socket.on('new_block', (socket) => {
      if(this.state.page == "Dashboard")
        this.mainPage.updateBlocks();
    });

    this.socket.on('peer_update', (socket) => {
      if(this.state.page == "Dashboard")
        this.mainPage.updatePeers();
    });

    this.socket.on('new_tx_in_pool', (socket) => {
      if(this.state.page == "Dashboard")
        this.mainPage.updateTxs();
    });
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;

    axios.get('/').then((response) => {
      this.setState((state) => {
        state.status = 'running';
        return state;
      });
      this.checkDefault();
    }).catch((error) => {
      console.log(error);
      this.setState((state) => {
        state.status = 'closed';
        return state;
      });
    });
  }

  pageChanged(newPage) {
    this.setState({"page": newPage});
  }

  checkDefault() {
    axios.get("/info_wallet").then((response) => {
      let data = response.data;
      if(data.hasOwnProperty('address')) {
        this.setState((state) => {
          state.status = 'yes_dw';
          return state;
        });
      }
      else {
        this.setState((state) => {
          state.status = 'no_dw';
          return state;
        });
      }
    }).catch((error) => {
      console.log(error);
      this.setState((state) => {
        state.status = 'closed';
        return state;
      });
    });
  }

  notify(message, type, pos='bc') {
    this._notificationSystem.addNotification({
      message: message,
      level: type,
      position: pos
    });
  }

  render() {
    let page = <div />;
    if(this.state.status === null) {
      page = <div>Connecting to Coinami Engine</div>;
    }
    else if(this.state.status === "running") {
      page = <div>Checking your wallet</div>;
    }
    else if(this.state.status === "closed") {
      page = <div>Could not connect to Coinami Engine :(</div>;
    }
    else if(this.state.status === "yes_dw") {
      page = <MainPage />;
    }
    else if(this.state.status === "no_dw") {
      page = <ChooseWallet />;
    }

    return (
      <MuiThemeProvider>
        <div className="wrapper">
          <div className="content">
            {page}
          </div>
          <NotificationSystem ref="notificationSystem" />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
