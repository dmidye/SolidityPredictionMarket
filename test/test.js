const { assert } = require('chai');

// bring contract into file
const Predictor = artifacts.require('./contracts/Predictor.sol'); 

require('chai').use(require('chai-as-promised')).should();

contract( 'Predictor', ([completer, creator, accepter]) => {
    let contract;

    // gives each testing stage a copy of the contract, reduces code reuse
    before(async () => {
        contract = await Predictor.deployed();
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await contract.address;
            assert.notEqual(address, '0x0');
            assert.notEqual(address, 'null');
            assert.notEqual(address, 'undefined');
            assert.notEqual(address, '');
        })

        it('returns correct name', async () => {
            const name = await contract.name();
            assert.equal(name, 'Prediction Marketplace');
        })
    })

    describe('predictions', async() => {
        let result, predictionCount, beforeCreateBalance, contractAddress;

        before(async () => {
            // when a prediction is created, pass the betAmount they specify through msg.value
            // betAmount for each prediction is set when the function event is emitted
            contractAddress = await contract.address;
            beforeCreateBalance = await web3.eth.getBalance(contractAddress);
            beforeCreateBalance = new web3.utils.BN(beforeCreateBalance);

            result = await contract.createPrediction('Price of lumber', 'Price of lumber increases 10%', completer, { from: creator, value: web3.utils.toWei('.1', 'ether') });
            predictionCount = await contract.predictionCount();     
        })

        it('creates a prediction', async () => {
            assert.equal(predictionCount, 1);
            
            const event = result.logs[0].args;

            assert.equal(event.id.toNumber(), predictionCount.toNumber(), 'id is correct');
            assert.equal(event.creator, creator, 'owner is correct');
            assert.equal(event.name, 'Price of lumber', 'name is correct');
            assert.equal(event.betAmount, web3.utils.toWei('.1', 'ether').toString(), 'betAmount is correct');
            assert.equal(event.acceptanceCriteria, 'Price of lumber increases 10%', 'acceptanceCriteria is correct');
            assert.equal(event.complete, false, 'complete is correct');

            let afterCreateBalance, expectedBalanceAfterCreate, betAmount;
            afterCreateBalance = await web3.eth.getBalance(contractAddress);
            afterCreateBalance = new web3.utils.BN(afterCreateBalance);

            betAmount = await web3.utils.toWei('.1', 'ether');
            betAmount = new web3.utils.BN(betAmount)

            expectedBalanceAfterCreate = beforeCreateBalance.add(betAmount);

            assert.equal(expectedBalanceAfterCreate.toString(), afterCreateBalance.toString(), "ether was transfered from creator to contract");
        })

        it('can accept a prediction', async () => {
            beforeAcceptBalance = await web3.eth.getBalance(contractAddress);
            beforeAcceptBalance = new web3.utils.BN(beforeAcceptBalance);

            // call acceptPrediction function, the _id will be passed based on what json value is recieved
            let acceptedPrediction;
            acceptedPrediction = await contract.acceptPrediction(1, { from: accepter, value: web3.utils.toWei('.1', 'ether') });
            
            // test that accepter is set
            assert.equal(acceptedPrediction.logs[0].args.accepter, accepter, 'accepter is correct');

            // test that accepter gave money to contract
            afterAcceptBalance = await web3.eth.getBalance(contractAddress);
            afterAcceptBalance = new web3.utils.BN(afterAcceptBalance);

            betAmount = await web3.utils.toWei('.1', 'ether');
            betAmount = new web3.utils.BN(betAmount)

            const expectedBalance = beforeAcceptBalance.add(betAmount);

            assert.equal(afterAcceptBalance.toString(), expectedBalance.toString(), "accepter paid contract");
        })

        it('can complete a prediction and pay out to winner with 2 participants', async () => {
            beforeCompleteBalance = await web3.eth.getBalance(creator);
            beforeCompleteBalance = new web3.utils.BN(beforeCompleteBalance);

            console.log("before balance", beforeCompleteBalance.toString())

            let winner; // for clarity
            winner = creator;

            // call acceptPrediction function, the _id will be passed based on what json value is recieved
            completedPrediction = await contract.completePrediction(1, winner, { from: completer });
            
            // test that accepter is set
            assert.equal(completedPrediction.logs[0].args.complete, true, 'complete is set to true');

            // test that accepter gave money to contract
            afterCompleteBalance = await web3.eth.getBalance(creator); // should be .2 ether higher than before balance (creator and accepter each put in .1)
            afterCompleteBalance = new web3.utils.BN(afterCompleteBalance);

            betAmount = await web3.utils.toWei('.1', 'ether');
            betAmount = new web3.utils.BN(betAmount);
            betAmount = betAmount.add(betAmount); // double betAmount

            const expectedBalance = beforeCompleteBalance.add(betAmount);

            assert.equal(afterCompleteBalance.toString(), expectedBalance.toString(), "accepter paid contract");
        })
    })
})

