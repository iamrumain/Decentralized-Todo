# 📝 Decentralized Todo App  
**Built with Next.js, Hardhat, Solidity & Ethers.js**

A fully decentralized Todo application where users can manage their tasks directly on the blockchain using a smart contract. This project demonstrates real-world Web3 concepts such as wallet connection, smart contract interaction, and decentralized data storage.

---

## 📌 Table of Contents

- Introduction  
- Features  
- Tech Stack  
- Project Architecture  
- Smart Contract Details  
- Installation Guide  
- Hardhat Setup  
- Frontend Setup  
- MetaMask Configuration  
- How the App Works  
- Screenshots  
- Common Errors & Fixes  
- Future Improvements  
- License  
- Author  

---

## 📖 Introduction

This **Decentralized Todo App** allows users to create and manage todo tasks using an Ethereum smart contract.  
Unlike traditional todo apps, all data is stored on the blockchain, making it transparent, secure, and tamper-proof.

The project is ideal for:
- Learning Web3 development  
- Understanding smart contract interaction  
- Building decentralized applications (DApps)  

---

## 🚀 Features

- 🔐 Connect wallet using MetaMask
- 📝 Create new todo items
- ✅ Mark todos as completed / incomplete
- 📡 Read data directly from blockchain
- ⛓ Smart contract deployed using Hardhat
- ⚡ Fast UI built with Next.js
- 🔁 Automatic UI update after transactions

---

## 🛠 Tech Stack

### Frontend
- **Next.js (App Router)**
- **React.js**
- **Ethers.js**
- **JavaScript**
- **MetaMask**

### Blockchain / Backend
- **Solidity**
- **Hardhat**
- **Ethereum (Localhost / Testnet)**

---




## 📜 Smart Contract Details

### Contract Name: `TodoList.sol`

### Functions:
- `createTodo(string memory _text)`
- `getTodoCount()`
- `getTodoByIndex(uint index)`
- `toggleCompleted(uint id)`
- `deleteTodo(uint id)`

### Todo Structure:
- `id` → uint
- `text` → string
- `isCompleted` → bool

All todos are permanently stored on the blockchain.

---

## ⚙️ Installation Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/iamrumain/Decentralized-Todo-App.git
cd decentralized-todo-app
2️⃣ Install Dependencies
bash
Copy code
npm install
🔗 Hardhat Setup
3️⃣ Start Local Blockchain
bash
Copy code
npx hardhat node
This will start a local Ethereum node at:

cpp
Copy code
http://127.0.0.1:8545
4️⃣ Deploy Smart Contract
bash
Copy code
npx hardhat run scripts/deploy.js --network localhost
📌 Copy the deployed contract address
📌 Paste it into:

js
Copy code
// constants/index.js
export const Todo_address = "0xYourContractAddress";
🖥 Frontend Setup
5️⃣ Start Next.js App
bash
Copy code
npm run dev
Open browser:

arduino
Copy code
http://localhost:3000
🔐 MetaMask Configuration
Install MetaMask extension

Add Network:

Network Name: Localhost 8545

RPC URL: http://127.0.0.1:8545

Chain ID: 31337

Import an account using Hardhat private key

🔄 How the App Works
User connects MetaMask wallet

App checks existing blockchain account

Smart contract is accessed via Ethers.js

User adds a todo → transaction is sent

Blockchain confirms transaction

UI updates with latest data
