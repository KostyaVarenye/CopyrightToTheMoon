// must import react for services because we work with components !
import React from "react";
import { GiCompass, GiDiamondHard } from "react-icons/gi";
import { FaEthereum } from "react-icons/fa";
// links used in the nav bar
export const links = [
  {
    id: 1,
    text: "home",
    url: "/",
  },
  {
    id: 2,
    text: "about",
    url: "/about",
  },
  {
    id: 3,
    text: "products",
    url: "/products",
  },
];

// homepage about info
export const services = [
  {
    id: 1,
    icon: <FaEthereum />,
    title: "Eth",
    text: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Do not miss your chance to be part of the digital economy, the economy of the future.",
  },
  {
    id: 2,
    icon: <GiCompass />,
    title: "mission",
    text: "Our mission is to bring the blockchain to the masses by creating self sustanable smart contracts that work for you. Thus turning the process of licensing copyrighted materials with ease.",
  },
  {
    id: 3,
    icon: <GiDiamondHard />,
    title: "vision",
    text: "Our vision is to create a future where you no longer need to deal with cumbersome licensing. We want to create an easy and transparent platform for all parties and create a prosperous future together.",
  },
];
//deployed, may need to swap for netlify.app/funcions/... : https://copyrighttothemoon.netlify.app/api/3-z-complete  https://copyrighttothemoon.netlify.app/api/3-z-complete?id=

export const products_url = "http://localhost:8888/api/3-z-complete";

export const single_product_url = "http://localhost:8888/api/3-z-complete?id=";
