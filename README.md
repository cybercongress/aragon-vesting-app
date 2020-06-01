# Aragon Vesting Dapp for Cyber Foundation

## About the app
The Vesting app is used to vest your cyber\~Foundation tokens (GOL, THC)  until the end of cyber\~Auction. It is also used to claim an equivalent, 1-to-1, amount of tokens in the Cyber blockchain (if the Foundation tokens are vested).

GOL tokens are the testing equivalent of THC. THC is the main governing token of Cyber. THC is an ERC-20 token and lives in the Ehereum mainnet. 

Your tokens will be locked for transfer, if and when vested(!), for the duration of the auction + for a set amount of days after its end (for euler~Foundation this is set to 10 days after the end of the auction). But, are available to be used for participating in the governance of the DAO. The auction is part of Cybers distribution process, where for a period of a certain time, donors that wish to become stakeholders in the governance of Cyber, donate ETH to cyber\~Fundation, the community governed DAO. You are welcome to read and explore more information about cyber\~Autcion [here](https://github.com/cybercongress/congress/blob/master/ecosystem/Cyber%20Homestead%20doc.md#cyberauction-or-auction).

After the end of the auction and the finalization of the distribution, the tokens will be unlocked for transfer. From this point onwards, cyber\~Congress will no longer be responsible for their transfer.

If you don't vest your tokens during the auction, they will become available for transfers, and for example, for trading on Uniswap or OTC. In both cases, the value of the Foundation tokens is determined by market demand and comes from the ability to participate in the governance of the Foundation and from their ability to claim CYB tokens (Cybers mainnet tokens) on 1-1 basis (if vested!). If you transfer non-vested tokens to another account, you are also transferring vesting rights. Each token can only be vested once! 

It should be noted that the vesting companion will be turned off for everyone at the same time, which is determined by the end time of the vesting, that is determined by the end time of the auction + 10 days. This will also impose the burning of the unclaimed CYB tokens. Users who participate at the end of the auction will face a larger inflation washdown of their share, as there will be more tokens available on the market for the same price.  

The vesting can be stopped by the cyber~Congress DAO Agent at any time due to activation of a crisis protocol (for example, a hack of the hot wallet).

Features:
- Vest and lock user tokens for transfers, until a set date
- Claim creation
- Process user claims state

Under the hood, we need proof that the tokens go to the desired destination. The flow is fairly simple:
- The companion is a program that knows for which events to look out for (listens to the vesting contract)
- It has a cyber key and an ETH key that can add proofs 
- when a claim event arrives, it looks for the address that sent the tokens
- Receives the transaction
- Adds proof
- Send the transaction, along with the proof, to the vesting contract 
- You can see the hash of a successful transfer in the app

## Description of flow
1. Tokens get distributed by a stand-alone auction contract
2. With the help of this dapp agents may request tokens in another chain by locking the foundation tokens for transfer (vesting) till the end of the auction (after bought and claim on auction window)
3. There is stand-alone event watcher which tracks events from locker contract and sends tokens to a given account in another chain
4. Till tokens are locked (part or all) agents are allowed to vote on proposals in the DAO with whole balance

## Prepare
```
npm install @aragon/cli -g
```

## Run

In app directory (app hot reload and script rebuild)
```
npm run start
```

```
npm run watch:script
```

In project root
```
npm run start:ipfs:template
```
