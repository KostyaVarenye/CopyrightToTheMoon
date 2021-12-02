const LicenseContract = artifacts.require("LicenseContract");

module.exports = function (deployer) {
  //deploy requires name, artist, fee in wei
  // deployment with contract, name, artist, fee, admin, contract owner
  const licenseName = "thriller";
  const artistName = "michael jackson";
  const feeInWei = 2000000000;
  deployer.deploy(
    LicenseContract,
    licenseName,
    artistName,
    feeInWei,
    "0x58d1d9316456da5360c5289db49be7840b512553",
    "0xedfb27fadb4fff5dcb21b2f2479438441c659eca"
  );
};
