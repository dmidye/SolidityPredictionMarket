import Web3 from "web3";

//window.ethereum.request({ method: "eth_requestAccounts" });
let web3;

if (typeof window !== "undefined" && typeof window.ethereum != "undefined") {
    // we're in the browser and metamask is running
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
} else {
    // we're on the server OR the user is not running metamask
    // Because we are not given a provider by the user, we need to provide our own
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/15c1d32581894b88a92d8d9e519e476c"
    );

    web3 = new Web3(provider);
}

//const web3 = new Web3(window.ethereum);

export default web3;