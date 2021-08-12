import React, { Component } from 'react';
import web3 from './web3';

class Main extends Component {
  render() {
    return (
        <div id="content">
        <h1>Add Prediction</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.predictionName.value
          const acceptanceCriteria = this.acceptanceCriteria.value
          const completer = web3.utils.toChecksumAddress("0x360A39c3D0922a63C891f81cc3d43CB3792EDDcF")
          const betAmount = web3.utils.toWei(this.betAmount.value.toString(), 'Ether')
          this.props.createPrediction(name, acceptanceCriteria, betAmount, completer)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="predictionName"
              type="text"
              ref={(input) => { this.predictionName = input }}
              className="form-control"
              placeholder="Prediction Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="betAmount"
              type="text"
              ref={(input) => { this.betAmount = input }}
              className="form-control"
              placeholder="Bet Amount"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="acceptanceCriteria"
              type="text"
              ref={(input) => { this.acceptanceCriteria = input }}
              className="form-control"
              placeholder="Acceptance Criteria"
              required />
          </div>
          {/* <div className="form-group mr-sm-2">
            <input
              id="completer"
              type="text"
              ref={(input) => { this.completer = "0x360A39c3D0922a63C891f81cc3d43CB3792EDDcF" }}
              className="form-control"
              placeholder="Completer"
              required />
          </div> */}

          
          <button type="submit" className="btn btn-primary">Add Prediction</button>
        </form>
        <p>&nbsp;</p>
        <h2>Accept Prediction</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Bet Amount</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="predictionList">
            { this.props.predictions.map((prediction, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{prediction.id.toString()}</th>
                  <td>{prediction.name}</td>
                  <td>{window.web3.utils.fromWei(prediction.betAmount.toString(), 'Ether')} Eth</td>
                  <td>{prediction.owner}</td>
                  <td>
                    { !prediction.accepted
                      ? <button
                          name={prediction.id}
                          value={prediction.betAmount}
                          onClick={(event) => {
                            this.props.acceptPrediction(event.target.name, event.target.value)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
