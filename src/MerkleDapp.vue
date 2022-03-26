<template>
  <div id="app" class="container">
    <div class="header">
      <div class="logo">
        <img
          class="mainLogo"
          src="./assets/8Bit/8BitLogo.svg"
          alt="BitBots Logo"
        />
      </div>
      <v-spacer />
      <div class="links">
        <div class="homepage link">Homepage</div>
        <div class="discord link">
          <a href="https://discord.com/"
            ><img src="./assets/logos/DiscordLogo.svg" alt="Discord"
          /></a>
        </div>
        <div class="twitter link">
          <a href="https://twitter.com/"
            ><img src="./assets/logos/TwitterLogo.svg" alt="Twitter"
          /></a>
        </div>
        <div class="opensea link">
          <a href="https://opensea.io/">
            <img src="./assets/logos/OpenSeaLogo.svg" alt="OpenSea" />
          </a>
        </div>
      </div>
    </div>

    <div class="alertHolder">
      <v-alert
        width="40rem"
        v-model="alertActive"
        border="left"
        colored-border
        type="error"
        elevation="2"
        dismissible
        transition="scroll-x-transition"
        :timeout="3000"
      >
        {{ alertText }}
      </v-alert>
    </div>

    <div class="content">
      <div class="leftImage contentImage">
        <img src="./assets/8Bit/BitsToTheRight.gif" alt="Bits To the right" />
      </div>
      <div class="mintSection">
        <label for="" class="supply"
          >{{ boughtSupply }}/{{ totalSupply }}</label
        >
        <div class="mintAmountArea">
          <v-btn class="decrementBtn" @click="decrement">-</v-btn>
          <div class="mintAmount">
            <label>{{ mintAmount }}</label>
          </div>

          <v-btn class="incrementBtn" @click="increment">+</v-btn>
        </div>
        <v-btn class="mintBtn" @click="mint">{{ mintButtonText }}</v-btn>
      </div>
      <div class="rightImage contentImage">
        <img src="./assets/8Bit/BitsToTheLeft.gif" alt="Bits To the left" />
      </div>
    </div>
    <div class="infoBox">
      <div class="gasInfo">Gas Limit: {{ gasLimit }}</div>
    </div>
  </div>
</template>


<script>
//const { MerkleTree } = require('merkletreejs');

import getContract from "./contracts/MerkleTest.js";
import { ethers } from "ethers";

import axios from "axios";

export default {
  name: "MerkleDapp",
  data() {
    return {
      mintButtonText: "Connect Wallet",

      alertActive: false,
      alertText: "",

      currentAccount: null,

      requiredChainId: 4, //Rinkeby net
      totalSupply: 1000,
      boughtSupply: 0,

      mintAmount: 1,
      maxmintAmount: 20,

      mintCost: 0.01,
      gasLimit: 400000,

      infoContent: "",
    };
  },
  mounted() {
    this.checkIfWalletIsConnected();
  },

  watch: {
    currentAccount: function () {
      if (this.currentAccount == null) {
        this.mintButtonText = "Connect Wallet";
      } else {
        this.mintButtonText = "Mint";
        this.getInfo();
      }
    },
  },

  methods: {
    updateAlert(text) {
      this.alertText = text;
      this.alertActive = true;
      //after 10000 ms change alertActive to false
      setTimeout(() => {
        this.alertActive = false;
      }, 10000);
    },

    increment() {
      if (this.mintAmount < this.maxmintAmount) {
        this.mintAmount++;
      }
    },
    decrement() {
      if (this.mintAmount > 1) {
        this.mintAmount--;
      }
    },

    checkIfWalletIsConnected: async function () {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          this.updateAlert("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          this.currentAccount = account;
        } else {
          console.log("No authorized account found");
        }
      } catch (error) {
        console.log(error);
      }
    },

    connectWallet: async function () {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          this.updateAlert("Get MetaMask!");
          return;
        }
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected", accounts[0]);
        this.currentAccount = accounts[0];
      } catch (error) {
        console.log(error);
      }
    },

    getInfo: async function () {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        let currentChainId = await (await provider.getNetwork()).chainId;
        console.log(currentChainId);
        if (currentChainId != this.requiredChainId) {
          this.updateAlert(
            "You have the wrong Network selected.\nPlease change to the Network with the Network-ID " +
              this.requiredChainId +
              " on your Metamask."
          );
          return;
        }

        let val = await getContract(provider).totalSupply();
        this.boughtSupply = val;
      } catch (error) {
        console.log(error);
      }
    },

    mint: async function () {
      this.checkIfWalletIsConnected();
      
      if (this.currentAccount == null) {
        //Try to connect Wallet
        this.connectWallet();

        //if it still is not connected don´t do anything
        if (this.currentAccount == null) {
          return;
        }
      } else {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          let currentChainId = await (await provider.getNetwork()).chainId;
          console.log(currentChainId);
          if (currentChainId != this.requiredChainId) {
            this.updateAlert(
              "You have the wrong Network selected.\nPlease change to the Network with the Network-ID " +
                this.requiredChainId +
                " on your Metamask."
            );
            return;
          }

          const contract = getContract(provider);
          const signer = provider.getSigner();
          const contractWithSigner = contract.connect(signer);
          /* global BigInt */
          var cost = BigInt(
            this.mintAmount * this.mintCost * 1000000000000000000
          );
          var options = { gasLimit: this.gasLimit, value: cost };
          console.log(options);

          //getProof

          let hexProof;
          await axios
            .get("https://merklebackend.hieserfj.de", {
              params: { address: this.currentAccount },
            })
            .then((response) => (hexProof = response.data.proof));

          var outPut = await contractWithSigner.mint(
            hexProof,
            this.mintAmount,
            options
          );

          console.log(outPut);
        } catch (error) {
          console.log(error);
          this.updateAlert(
            "An error has occured during the minting process. If you didn´t reject the transaction, please contact the responsible developer of this Collection to get help."
          );
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

@font-face {
  font-family: Pixeled;
  src: local("Pixeled"),url(./fonts/Pixeled.ttf) format("truetype");
}

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;

  height: 100%;

  display: flex;
  flex-direction: column;
  font-family: "Pixeled";
  font-size: 1.2rem;
  padding: 1rem;

  color: rgb(0, 0, 0);
  font-size: 1.2rem;

  .header {
    orientation: right;
    display: flex;
    justify-content: flex-end;

    .logo {
      margin-left: 2rem;
      .mainLogo {
        width: 24rem;
      }
    }

    .links {
      .link {
        margin: 16px;

        img {
          width: 2em;
          height: 2rem;
        }
      }
    }
  }
  .alertHolder {
    font-family: "Tahoma";
    align-self: flex-end;
    position: absolute;
  }

  .content {
    display: flex;
    justify-content: center;

    .contentImage {
      margin: 2rem;
      img {
        width: 320px;
        height: 320px;
      }
    }

    .mintSection {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .supply {
        margin: 1rem;
      }

      .mintAmountArea {
        margin: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .mintAmount {
          display: flex;
          justify-content: center;
          width: 16px;
          margin: 1rem;
        }
      }

      .mintBtn {
        margin: 1rem;
      }
    }
  }
}
</style>