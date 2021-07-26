pragma solidity ^0.5.0;

contract Predictor {
    string public name;
    mapping(uint => Prediction) public predictions; // need a place to store every prediction created - Key => Value
    uint public predictionCount = 0; 
    
    constructor() public {
        name = "Prediction Marketplace";
    }

// A Prediction will be something that a user submits along with the amount of ether they want to bet that it comes true
// Initially, a third party will have to confirm or deny that the prediction came true (oracles eventually??)
    struct Prediction {
        uint id;
        address payable creator;
        address payable accepter;
        string name; 
        string acceptanceCriteria; // how do we know if the prediction came true or not?
        uint betAmount;
        bool complete;
    }

    event PredictionCreated (
        uint id,
        address payable creator,
        address payable accepter,
        string name,
        string acceptanceCriteria,
        uint betAmount,
        bool complete
    );

    event PredictionAccepted (
        uint id,
        address payable creator,
        address payable accepter,
        string name,
        string acceptanceCriteria,
        uint betAmount,
        bool complete
    );

    // create predictions
    function createPrediction(string memory _name, string memory _acceptanceCriteria) public payable {
        require(bytes(_name).length > 0);
        require(bytes(_acceptanceCriteria).length > 0);
        require(_betAmount > 0);
        
        predictionCount++;
        // create the prediction
        Prediction memory prediction = Prediction(predictionCount, msg.sender, address(0), _name, _acceptanceCriteria, _betAmount, false);

        predictions[predictionCount] = prediction;

        // transfer ether from creator to contract
        //address payable contractAddress = address(this);
        address(this).transfer(msg.value);

        emit PredictionCreated(predictionCount, msg.sender, address(0), _name, _acceptanceCriteria, _betAmount, false);
    }

    // accepting a prediction is defined as a user seeing a prediction and clicking the 'accept' button next to it
    // this is them saying "I think that's wrong, so I will bet against it"
    function acceptPrediction(uint _id) public payable {
        // the accepter will need to put money up too, just using the same amount as the creator for now

        // set the accepter for the prediction to be the sender of this contract call
        Prediction memory _prediction = predictions[_id];
        _prediction.accepter = msg.sender;

        uint _betAmount = _prediction.betAmount;

        // transfer ether from accepter to contract (accepter is taken from the "from: " metadata)
        address(this).transfer(msg.value);

        predictions[_id] = _prediction;

        emit PredictionAccepted(predictionCount, _prediction.creator, msg.sender, _prediction.name, _prediction.acceptanceCriteria, _betAmount, false);
    }

    // needed to send money to contract address
    function() external payable {}

}