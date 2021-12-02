import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useCartContext } from "../context/cart_context";
import { useUserContext } from "../context/user_context";
import { formatPrice } from "../utils/helpers";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import { LicenseContractAbi } from "../abi/licenseContractAbi";

//create web3 provider with metamask
const web3 = new Web3(Web3.givenProvider);

const contractAddr = "0x4711957896E8d441bF42105F2132E4549B726b44";
const licenseContract = new web3.eth.Contract(LicenseContractAbi, contractAddr);

const CheckoutForm = () => {
  //get the data from cart context and user context. history is for forwarding the user after completion.
  const { cart, total_amount, clearCart, fee } = useCartContext();
  const { myUser } = useUserContext();
  const history = useHistory();

  //Metamask state if succeeded or error
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);

  //intent
  const createPaymentIntent = async () => {
    try {
      //post to the server with create intent
      const data = await axios.post(
        "http://localhost:8888/api/create-payment-intent",
        JSON.stringify({ myUser })
      );
      console.log(data);
    } catch (error) {}
  };
  useEffect(() => {
    // we create a payment intent for
    createPaymentIntent();
    //eslint-disable-next-line
  }, []);

  // what we do next
  // contract address is provided by Truffle migration
  // testing simple contract.
  const [number, setNumber] = useState(0);
  const [getNumber, setGetNumber] = useState("0x00");

  const handleGetDetails = async (e) => {
    e.preventDefault();
    const result = await licenseContract.methods.getDetails().call();
    console.log(licenseContract.options.address);
    //setGetNumber(result);
    console.log(result);
  };

  const handleActivateAndWithdraw = async (e) => {
    e.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const result = await licenseContract.methods
      .adminWithdrawAndActivate()
      .send({ from: account, gas: 45000000 }, function (receipt) {
        console.log(receipt);
      });
    console.log(result);
  };

  const handlePayActivationFee = async (e) => {
    e.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    console.log(account);
    const value = web3.utils.toWei("1", "ether");
    const gas = await licenseContract.methods
      .payActivationFee()
      .estimateGas({ from: account }, function (gasAmount) {
        licenseContract.methods.payActivationFee().send(
          {
            from: account,
            value: value,
            gas: 4500000,
          },
          function (error) {
            console.log(error);
          }
        );
      });
  };
  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handlePayActivationFee}>
          <input type="submit" value="Pay activation fee" />
        </form>
        <br />
        <button onClick={handleGetDetails} type="button">
          Get Contract Details
        </button>
        {}
        <br />
        <button onClick={handleActivateAndWithdraw} type="button">
          Activate contract
        </button>
        {}
      </header>
    </div>
  );
};

const MetamaskCheckout = () => {
  return (
    <Wrapper>
      <CheckoutForm />
    </Wrapper>
  );
};

const Wrapper = styled.section`
  form {
    width: 30vw;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
  }
  input {
    border-radius: 6px;
    margin-bottom: 6px;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    font-size: 16px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  .result-message {
    line-height: 22px;
    font-size: 16px;
  }
  .result-message a {
    color: rgb(89, 111, 214);
    font-weight: 600;
    text-decoration: none;
  }
  .hidden {
    display: none;
  }
  #card-error {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    margin-top: 12px;
    text-align: center;
  }
  #card-element {
    border-radius: 4px 4px 0 0;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  #payment-request-button {
    margin-bottom: 32px;
  }
  /* Buttons and links */
  button {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 0 0 4px 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export default MetamaskCheckout;
