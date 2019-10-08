# Locker/Claim Aragon Dapp for Cyber Foundation

## Status
1. Contract - alpha, general flow works, debugging
2. Front - on construction, working mocks


## Description of flow
1. Tokens distribute by stand-alone auction contract.
2. With the help of this dapp agent may request tokens in another chain by locking foundation tokens for transfer (vesting) till the end of the auction (after bought and claim on auction window)
3. There is stand-alone event watcher which track event from locker contract and sends tokens for a given account in another chain.
4. Till tokens locked (part or all) agent allowed to vote on the proposal in DAO with whole personal balance.


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

## Debug
[eth-cli](https://github.com/protofire/eth-cli)

```
eth conf:abi:add claim build/contracts/Claim.json
eth repl claim@<appAddress>
> claim.methods.transferableBalanceOf("0xb4124cEB3451635DAcedd11767f004d8a28c6eE7").call()
'9'
>  claim.methods.balanceOf("0xb4124cEB3451635DAcedd11767f004d8a28c6eE7").call()
'10'
```

## Proposed Front
[figma](https://www.figma.com/file/6RyVF5IW2j8bBO1aCkU4lF/Claim-app?node-id=1%3A2280)