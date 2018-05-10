pragma solidity ^0.4.17;

contract CampaignFactory {
    // this will deploy campaign instances for use
    // to network
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        // creates new Campaign
        // and returns address of campaign
        
        // make sure manager address is passed (current msg.sender)
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    // Request struct definition only
    // This is a TYPE, not instance of variable.
    // Can have multiple Requests all at once.
    
    // reference types like mapping don't need to be initialized.
    // this is stupid.
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    // dynamic array of Request structs
    Request[] public requests;

    // STORAGE vars.
    // `storage` keyword turns variable into &ref, ownership contract.
    // `memory` keyword makes a copy, and transfers ownership to function.
    // will be garbage collected after func returns. (this is default).
    // If we pass into func as an arg, it is a copy.  if that is changed in func
    // and func returns/ends then that copy dies.  If we use `storage` it will
    // be reference and mutate the storage variable, persisting past life of
    // function that is passed the arg.
    
    // the manager of Campaign.
    address public manager;
    // min contribution varies per Campaign
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        // yield/include
        _;
    }

    // NOTE: msg obj is global and free
    // msg.sender - address
    // msg.value - attached transaction value
    function Campaign(uint minimum, address creator) public {
        // factory address becomes msg.sender
        // when CampaignFactory creates instance of campaign
        manager = creator;
        minimumContribution = minimum;
    }

    // payable - means can take money
    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(string description, uint value, address recipient) public restricted {
        // This is auto created in memory, not storage.
        // Always `memory` because its an instance.
        Request memory newRequest = Request({
           description: description,
           value: value,
           recipient: recipient,
           complete: false,
           approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint index) public {
        // bring in ref request
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        // make sure they have not approved before.
        require(!request.approvals[msg.sender]);

        // mark as voted and increment.
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        // set true
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          this.balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}