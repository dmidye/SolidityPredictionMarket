pragma solidity >=0.5.0;

contract HelloWorld {
    string private greeting;
    string public name;

    constructor() public {
        greeting = "Hello World";
        name = "asfd";
    }

    function getGreeting() public view returns(string memory){
        return greeting;
    }
}