const { assert } = require('chai');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// bring contract into file
const HelloWorld = artifacts.require('./contracts/HelloWorld.sol'); 

require('chai').use(require('chai-as-promised')).should();

contract('Hello', ([deployer, author, tipper]) => {
    let contract;

    // gives each test a copy of the contract, reduces code reuse
    before(async () => {
        contract = await HelloWorld.deployed();
    })

    // test that a valid creator address is retrieved
    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = contract.address;
            assert.notEqual(address, '0x0');
            assert.notEqual(address, 'null');
            assert.notEqual(address, 'undefined');
            assert.notEqual(address, '');

        })

        it('returns hello world greeting', async () => {
            const greeting = await contract.greeting();
            assert.equal(greeting, "Hello World");
        })
    })
})

