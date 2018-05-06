import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
	// Auto moves this to old constructor() with super(props)
	state = {
		manager: '',
		players: [],
		balance: '',
    value: '',
    message: ''
	};

  async componentWillMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

   	this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
  
    const accounts = await web3.eth.getAccounts();

    // spinner.
    this.setState({ message: 'Waiting on transaction success... '});

    await lottery.methods.enter().send({
      from: accounts[0], // assuming first from accounts is enter into lottery
      value: web3.utils.toWei(this.state.value, 'ether')
    });
    
    // on completion messaging.
    this.setState({ message: 'You have been entered!'});
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    // spinner.
    this.setState({ message: 'Waiting on transaction success... '});

    // When we send transaction we get no return back...
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    // completion messaging
    this.setState({message: 'A winner has been picked!  Count your monies!!'});
  }

  render() {
    // Check version of web3
    console.log("web3 version...", web3.version);
    web3.eth.getAccounts().then(console.log);

    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} players entered and competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor="">Amount of ether to enter</label>
            <input 
              onChange={event => this.setState({ value: event.target.value })}
              type="text"/>
          </div>
          <button>Enter</button>
        </form>
        
        <hr/>
        <h1>{this.state.message}</h1>

        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>
          Pick a winner!
        </button>

      </div>
    );
  }
}

export default App;
