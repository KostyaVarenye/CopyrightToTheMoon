//SPDX-License-Identifier: MIT

pragma solidity >=0.6.6 < 0.9.0;

contract LicenseContract{
    //VARIABLES
    //______________________________________________________________________________
    
    //CONTRACT
    address licenseOwner;
    string songName;
    string artistName;
    uint256 priceFee;
    uint256 thirtyDaysInSeconds = 2592000;
    uint256 createdTime;
    
    //ADMIN
    address admin;
    uint adminBalance;
    bool adminLicenseActive = false;
    bool adminLicenseFundsWithdrawn = false;
    
    //OWNER
    uint contractBalance;
    
    
    //array of licensees, used for new licensees who buy the license
    address[] public licensees;
    //array of licensees, used for keeping a history of licensees who bought the license
    address[] public registeredLicensees;
    //mappings key, value for address to amount payed AND the other one is an address to license expiry date in unix style(seconds) used for internal calculations
    mapping(address => uint256) public addressToAmountPaid;
    //expiry of license by address
    mapping(address => uint256) public addressToLicenseExpire;
    //handle for registered licenses address -> string
    mapping(address => string) public addressToUser;
    
    // CONSTRUCTOR
    //______________________________________________________________________________
    constructor(string memory _name, string memory _artist, uint256 _priceFee, address _admin, address _licenseOwner) {
        createdTime = block.timestamp;
        admin = _admin;
        licenseOwner = _licenseOwner;
        songName = _name;
        artistName = _artist;
        priceFee = _priceFee;
    }
    
    // MODIFIERS
    //______________________________________________________________________________
    modifier onlyOwner{
        require(msg.sender == licenseOwner, "permission denied");
        _;
    }
    
    modifier onlyAdmin{
        require(msg.sender == admin, "permission denied");
        _;
    }
    
    modifier onlyActivated{
        require(adminLicenseActive == true, "please pay activation fee");
        _;
    }
    
    //ADMIN FUNCTIONS
    //______________________________________________________________________________
    //function to set set license activation
    function activateLicenseAfterPayment() onlyAdmin private{
        adminLicenseActive = true;
    }
    
    // function to set license funds withdrawn
    function activateAdminFundsWithdrawn() onlyAdmin private{
        adminLicenseFundsWithdrawn = true;
    }
    
    // function that lets the admin of the contract to withdraw the initial fee
    function adminWithdrawAndActivate() onlyAdmin public {
        require(adminLicenseActive == false, "already activated");
        require(adminLicenseFundsWithdrawn = true, "nothing to withdraw");
        adminWithdraw();
        activateLicenseAfterPayment();
        adminBalance = 0;
    }
    
    function getAdminBalance() public view onlyAdmin returns(uint256){
        return adminBalance;
    }
    
    // function will send the ether fee to project admin - hardcoded ether should be swapped to a variable in production
    function adminWithdraw() onlyAdmin internal {
        payable(admin).transfer(getAdminBalance());
    }
    function whoIsOwner() onlyAdmin public view returns(address){
        return licenseOwner;
    }
    
    //OWNER FUNCTIONS
    //______________________________________________________________________________
    //function to activate License used by licenseOwner
    function payActivationFee() public payable onlyOwner returns(bool){
        require(msg.value == 1 ether, "must pay one ether to activate license!");
        adminBalance = adminBalance + msg.value;

        return true;
    }
    // deactivate license DANGER
    function deactivateLicenseAfterPayment() onlyOwner private{
        adminLicenseActive = false;
    }
    // get owner balance
    function getOwnerBalance() onlyOwner public view returns(uint256){
        return contractBalance;
    }
    
    // withdraw function
    // we run through the lisensees and withdraw all fees payed
    // as well as assign the license expiry dated for each
    function withdraw() payable onlyOwner onlyActivated public {
        require(contractBalance > 0, "withdrawal balance is empty");
        // for each full round of fees, we add 30 days for the license until expiry. this way multiples of 30 days can be purchased
        for(uint256 licenseIndex=0; licenseIndex < licensees.length; licenseIndex++){
            //get the address of the licensee
            address licensee = licensees[licenseIndex];
            //calculate the number of licences bought
            uint licensesBought = addressToAmountPaid[licensee]/priceFee;
            // calculate the seconds length of licences
            uint licensesInSeconds = licensesBought * thirtyDaysInSeconds;
            // update the time for license expiry
            if(addressToLicenseExpire[licensee] < createdTime){
                // means first assign, that is new address bought license
                addressToLicenseExpire[licensee] = block.timestamp + licensesInSeconds;
            }
            else{
                // addressToLicenseExpire[licensee] < block.timestamp - means already has active license
                // already has expiry date, that way we simple add to this time
                addressToLicenseExpire[licensee] = addressToLicenseExpire[licensee] + licensesInSeconds;
            }
            //reduce the amount payed for the next 
            addressToAmountPaid[licensee] = addressToAmountPaid[licensee] - priceFee*licensesBought;
            string memory empty = "";
            //add the licensee address to registered licensees array
            if(keccak256(bytes(addressToUser[licensee])) != keccak256(bytes(empty))){
                //we do not have the address in the book
                registeredLicensees.push(licensee);
            }
            // else we already have them in the array
        }
        //transfer all the owner balance to the owner address
        payable(msg.sender).transfer(contractBalance);
        contractBalance = 0;
        //reset the new licensees array
        licensees = new address[](0);
    }
    
    //returns true if the fee successfully changed
    function changeLicenseFee(uint _newFee) public onlyOwner returns(uint256){
        require(priceFee != _newFee, "The fee is already that price");
        priceFee = _newFee;
        return priceFee;
    }
    
    // contract self destruct 'DANGER' the contract remains still payable
    function licenseDeactivate() private onlyOwner {
        require(adminLicenseActive == true, "license is not active");
        adminLicenseActive = false;
        // selfdestruct(payable(licenseOwner));
        
    }
    
    // FUNCTIONS
    //______________________________________________________________________________
    
    function buy(string memory userHandle) public onlyActivated payable{
        //priceFee required to lease
        require(adminLicenseActive == true, "the license is not yet activated.");
        require(msg.value >= priceFee, "price fee required is not met" );
        //assing amount payed from an address
        addressToAmountPaid[msg.sender] += msg.value;
        string memory empty = "";
        if(
            keccak256(bytes(addressToUser[msg.sender]))
            ==
            keccak256(bytes(empty))){
            //add only new userName handle to the address 
            addressToUser[msg.sender] = userHandle;
        }
        // push address into licensees array
        licensees.push(msg.sender);
        // update contractBalance of the licence owner
        contractBalance += msg.value;
        // what the ETH->USD conversion rate is ?
    }
    
    
    // licensee check if you overpaid
    function checkRemainingFunds() public view returns(uint256){
        require(addressToAmountPaid[msg.sender]!=0, "you have no funds");
        return addressToAmountPaid[msg.sender];
    }
    
    // licensee can withdraw his own remainder of the funds
    function withdrawOwnFunds() public returns(uint256){
        uint256 amount = addressToAmountPaid[msg.sender];
        require(amount>0, "not enough to withdraw");
        payable(msg.sender).transfer(amount);
        addressToAmountPaid[msg.sender] = 0;
        return amount;
        
    }
    
    //return true if the license expired, false if the license is active
    function checkLicenseExpired(address _licensee) public view returns(bool){
        return !(addressToLicenseExpire[_licensee] > block.timestamp);
    }
    
    // returns the current fee of the contract
    function getCurrentLicenseFee() public view returns (uint256){
        return priceFee;
    }
    
    
    //get license details
    function getDetails() public view returns(string memory, string memory, uint256){
        return (songName, artistName, priceFee);
    }
    
    function licenseTimeRemainingInDays(address lisAddr) public view returns(int256){
        return int256(addressToLicenseExpire[lisAddr] - block.timestamp)/86400;
    }
}
    