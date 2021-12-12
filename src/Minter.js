/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import header from "./header.png";
import Unstoppable from './Unstoppable';


import {
  connectWallet,
  getCurrentWalletConnected,
  safeMint,
} from "./util/interact.js";

const Minter = (props) => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  
  
  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();

    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    const { success, status } = await safeMint(url, name, description);
    setStatus(status);
    if (success) {
      setName("");
      setDescription("");
      setURL("");
    }
  };
  
  return (
    <div className="space-y-16  p-4 bg-gray-900 font-sans, Georgia box-content w-auto h-auto">
      <div className="block space-y-4 p-6 h-32 bg-gray-900">
        <img className="float-left object-scale-down h-32 w-32 md:object-left-top m-2"  src={header} alt="Twiggy"></img>
        <Unstoppable></Unstoppable>
        <button 
          className="float-right py-3 px-6 transition ease-in-out duration-700 transform hover:-translate-y-1 hover:scale-110 ring-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 focus:from-white focus:to-indigo-500" 
          id="walletButton" 
          onClick={connectWalletPressed}>
            {walletAddress.length > 0 ? (
            "Connected: " +
            String(walletAddress).substring(0, 6) +
            "..." +
            String(walletAddress).substring(38)
          ) : (
            <span>Connect MetaMask</span>
          )}
        </button>
      </div>  {/* Nav */}
      <div> 
        <header 
          className="text-9xl text-purple-200 p-6 ml-16 font-bold" 
          id="title">
            Twiggy<br />NFT Minter
        </header>
        <p className="text-4xl text-white text-justify ml-20 p-4">This app mints the Big Tree NFTs on the Rinkeby network.</p>
      </div> {/* Header */}
      <div className="block p-4 m-24 rounded bg-gradient-to-r from-green-400 to-green-900">  
        <p className="text-2xl font-medium p-4">
          Add the name, description, and link to your asset or image (Pinata), then press "Mint NFT"
        </p>
        <form className="space-y-8 p-8 w-auto shadow-lg ">
          <h2 className="text-2xl font-bold ">NFT NAME: </h2>
          <input
            className="md:w-96 h-10 rounded text-1 border-2 border-blue-900 placeholder-gray-500 placeholder-opacity-50 focus:placeholder-gray-400 text-red-600 focus:text-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder=' e.g. "Skinny Trees"'
            onChange={(e) => setName(e.target.value)}
          />
          <h2 className="text-2xl font-bold">DESCRIPTION: </h2>
          <input
            className="md:w-96 h-10 rounded text-l border-2 border-blue-900 placeholder-gray-500 placeholder-opacity-50 focus:placeholder-gray-400 text-red-600 focus:text-blue-400 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder=" e.g. A collection of the Safari's finest"
            onChange={(e) => setDescription(e.target.value)}
          />
          <h2 className="text-2xl font-bold">LINK TO ASSET: </h2>
          <input
            className="md:w-96  h-10 rounded text-l border-2 border-blue-900 placeholder-gray-500 placeholder-opacity-50 focus:placeholder-gray-400 text-red-600 focus:text-blue-400 focus:outline-none focus:ring focus:border-blue-300"
            type="text"
            placeholder=" e.g. https://gateway.pinata.cloud/ipfs/<hash>"
            onChange={(e) => setURL(e.target.value)}
          />
        </form>
        <button 
          className="rounded mt-8 ml-8 py-3 px-6 transition duration-500 ease-in-out text-white bg-blue-700 hover:bg-white hover:text-blue-500"
          id="mintButton" 
          onClick={onMintPressed}>
          Mint NFT
        </button>
      </div> {/* Form */}
      <div className="block rounded m-12 font-mono space-y-4 p-8 bg-green-800">
        <p 
          className="p-4 rounded-sm bg-yellow-300" 
          id="status" 
          style={{ color: "red" }}>
            {status}
        </p>
      </div> {/* Footer */}
    </div>
  );
};

export default Minter;