import React, { Component } from 'react';
import './App.css';
//import Web3 from 'web3';
import web3 from './web3';
import Predictor from '../abis/Predictor.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      predictionCount: 0,
      predictions: [],
      loading: true
    }

    // basically linking the function outside of render method
    // to whenever it is called inside the render method
    // it's something tedious that has to be done, nothing special
    this.createPrediction = this.createPrediction.bind(this)
    this.acceptPrediction = this.acceptPrediction.bind(this)
  }

  async componentDidMount() {
    //await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {    
    // load account
    //const accounts = await web3.eth.getAccounts() <--- DEPRECATED WAY
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); // new way to get accounts
    console.log("loading blockchain data...")
    // the component re renders when setState is called
    this.setState( { account: accounts[0] }) // add it to state so it can be accessed inside component and seen in browser
    

    // Loading smart contract from blockchain via the abi
    const networkId = await web3.eth.net.getId()
    const networkData = Predictor.networks[networkId]

    if(networkData) {
      const contract = new web3.eth.Contract(Predictor.abi, networkData.address)
      this.setState({ predictor: contract })
      const predictionCount = await contract.methods.predictionCount().call()
      this.setState({ predictionCount })
      
      // load predictions
      // we have to load them one at a time because contracts can't return full lists
      console.log("pred count", this.state.predictionCount);
      
      for (var i = 1; i <= predictionCount; i++) {
        const prediction = await contract.methods.predictions(i).call()
        console.log("prediction", prediction)
        this.setState({
          predictions: [...this.state.predictions, prediction]
        })
      }
      
      this.setState({ loading: false })
    } else {
      window.alert('Contract not deployed to detected network.')
    }
  }

   createPrediction(name, acceptanceCriteria, betAmount, completer) {
    this.setState({ loading: true })
    this.state.predictor.methods.createPrediction(name, acceptanceCriteria, completer).send({ from: this.state.account, value: betAmount })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })

    console.log("first pred", this.state.predictor.methods.predictions(2).call())
  }

  acceptPrediction(id, betAmount) {
    this.setState({ loading: true })
    this.state.predictor.methods.acceptPrediction(id).send({ from: this.state.account, value: betAmount})
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}></Navbar>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading 
                  ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div> 
                  : <Main createPrediction={this.createPrediction} acceptPrediction={this.acceptPrediction} predictions={this.state.predictions}/>
              }
            </main>
          </div>
        </div>
      </div>
      

    );
  }
}

export default App;
