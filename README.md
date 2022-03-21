# merkleVueDapp

## Project setup
```
npm install
```
With this you can install any node modules needed for the project. Run it before you want to start with the whole project.
### Compiles and hot-reloads for development
```
npm run serve
```
This command allows you live deployment on your local system for development purposes. Start it and go onto your localhost to see changes life on your webpage. You have to safe changes though for it to work.
### Compiles and minifies for production
```
npm run build
```
With this you build your application. Search for the dist folder in your project, after you´ve run this command. The folder should contain the full project neetly packed in its necessary and compiled functions. Copy the folders contents and serve the index.html file via Apache or Nginx or any other server you want to use it on.


## Adapt this project

### Basic Structure

This is a project based on Vue.js, a Javascript Framework for Frontend-Development.
Without going into to much depth, Vue.js allows for a very structured approach in regards of capsuling functions and their respective UI and allows a fast development cycle.

Main points of this project:
public folder:
- index.html: the html file that gets served to the user later. The Vue.js part is attached to it via javascript

src folder
- main.js: This is the entry point of the Vue files. In this case the MerkleDapp.vue gets attached as the main page.
- MerkleDapp.vue: The main file of the whole project. It contains the HTML, Javascript as well as the CSS Code of the one and only page of this project. Here you can adapt the looks of your Frontend Page and the functionality for the interaction with the Contract takes place here.

- plugins folder: I used an extension for tidying up the space called vuetify. its stored in here
- fonts folder: The fonts are stored here
- contracts folder: The contract ABI and the address of the contract that the frontpage interacts with is stored here
- assets folder: The different kind of assets used in the MerkleDapp.vue are stored in here



### The Contract ABI Calls

You have to obviously adapt the contract and its API for this Dapp to work accordingly.
Go into the src/contracts folder and look at the MerkleTest.js
You have to adapt:

1. The ABI key
Copy the ABI key of the contract that you want to use into that field. You can get the ABI-Key on the according Etherscan (or other Network ScanSites) of your contract.

2. The contract Address
Use the address of the contract here. Pretty self explanatory.

These ABI Calls get used in the Javascript functionality of the MerkleDapp.vue in the src folder.
For the calls themself I use the ethers library.

The contract this project is connected to is the RevealableWhitelistOptimizedContract of my contract library (https://github.com/FHieser/contract_library). If you want to use a different contract with this Dapp make sure to either use the same parameters of the minting function in the new contract or adapt the ethers call accordingly.

### The frontend



